import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/apiConfig';
import ListaMascotas from '../components/ListaMascotas';

function GestionMascotas() {
    const navigate = useNavigate();

    // Rol del usuario (guardado en el login). Solo ADMIN puede modificar.
    const rol = localStorage.getItem('rol');
    let esAdmin = false;
    if (rol === 'ADMIN' || rol === 'ROLE_ADMIN') {
        esAdmin = true;
    }

    // Lista y mensajes
    const [mascotas, setMascotas] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [version, setVersion] = useState(0);

    // Datos del formulario de registro
    const [nombre, setNombre] = useState('');
    const [raza, setRaza] = useState('');
    const [foto, setFoto] = useState(null);

    // Datos del formulario de edición (modal)
    const [mascotaEditar, setMascotaEditar] = useState(null);
    const [editNombre, setEditNombre] = useState('');
    const [editRaza, setEditRaza] = useState('');
    const [editFoto, setEditFoto] = useState(null);

    // ---------- LISTAR ----------
    async function cargarMascotas() {
        try {
            const respuesta = await fetch(API_BASE_URL + '/auth/mascotas');
            if (respuesta.ok) {
                const datos = await respuesta.json();
                setMascotas(datos);
            } else {
                setMensaje('No se pudo cargar la lista');
            }
        } catch (error) {
            setMensaje('Error de red al cargar la lista'+error.message);
        }
    }

    // Al abrir la página: revisa el token y carga la lista
    useEffect(function () {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        async function cargarInicial() {
            try {
                const respuesta = await fetch(API_BASE_URL + '/auth/mascotas');
                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setMascotas(datos);
                }
            } catch (error) {
                setMensaje('Error de red al cargar la lista'+error.message);
            }
        }

        cargarInicial();
    }, [navigate]);

    // ---------- NAVEGACIÓN ----------
    function volverAlPerfil() {
        navigate('/perfil');
    }

    // ---------- CREAR ----------
    function cambiarNombre(evento) {
        setNombre(evento.target.value);
    }

    function cambiarRaza(evento) {
        setRaza(evento.target.value);
    }

    function cambiarFoto(evento) {
        setFoto(evento.target.files[0]);
    }

    async function guardarMascota(evento) {
        evento.preventDefault();

        if (esAdmin !== true) {
            setMensaje('No tienes permiso para agregar mascotas');
            return;
        }

        if (foto === null) {
            setMensaje('Debe seleccionar una foto');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('raza', raza);
            formData.append('foto', foto);

            const respuesta = await fetch(API_BASE_URL + '/auth/mascotas', {
                method: 'POST',
                body: formData
            });

            if (respuesta.status === 201) {
                setMensaje('Mascota guardada correctamente');
                setNombre('');
                setRaza('');
                setFoto(null);
                evento.target.reset();
                cargarMascotas();
            } else {
                setMensaje('Error al guardar la mascota');
            }
        } catch (error) {
            setMensaje('Error de red al guardar'+error.message);
        }
    }

    // ---------- ELIMINAR ----------
    async function eliminarMascota(id) {
        if (esAdmin !== true) {
            setMensaje('No tienes permiso para eliminar mascotas');
            return;
        }

        const confirmado = window.confirm('¿Desea eliminar esta mascota?');
        if (confirmado === false) {
            return;
        }

        try {
            const respuesta = await fetch(API_BASE_URL + '/auth/mascotas/' + id, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                setMensaje('Mascota eliminada correctamente');
                cargarMascotas();
            } else {
                setMensaje('No se pudo eliminar la mascota');
            }
        } catch (error) {
            setMensaje('Error de red al eliminar'+error.message);
        }
    }

    // ---------- EDITAR ----------
    function abrirEdicion(mascota) {
        if (esAdmin !== true) {
            setMensaje('No tienes permiso para editar mascotas');
            return;
        }

        setMascotaEditar(mascota);
        setEditNombre(mascota.nombre);
        setEditRaza(mascota.raza);
        setEditFoto(null);
    }

    function cerrarEdicion() {
        setMascotaEditar(null);
        setEditFoto(null);
    }

    function cambiarEditNombre(evento) {
        setEditNombre(evento.target.value);
    }

    function cambiarEditRaza(evento) {
        setEditRaza(evento.target.value);
    }

    function cambiarEditFoto(evento) {
        setEditFoto(evento.target.files[0]);
    }

    async function guardarEdicion(evento) {
        evento.preventDefault();

        if (esAdmin !== true) {
            setMensaje('No tienes permiso para editar mascotas');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nombre', editNombre);
            formData.append('raza', editRaza);

            // La foto es opcional: solo se envía si el usuario eligió una
            if (editFoto !== null) {
                formData.append('foto', editFoto);
            }

            const respuesta = await fetch(
                API_BASE_URL + '/auth/mascotas/' + mascotaEditar.id,
                {
                    method: 'PUT',
                    body: formData
                }
            );

            if (respuesta.ok) {
                setMensaje('Mascota actualizada correctamente');
                cerrarEdicion();
                setVersion(version + 1);
                cargarMascotas();
            } else {
                setMensaje('No se pudo actualizar la mascota');
            }
        } catch (error) {
            setMensaje('Error de red al actualizar'+error.message);
        }
    }

    function mostrarModal() {
        if (mascotaEditar === null) {
            return null;
        }

        return (
            <div className="modal-fondo">
                <div className="modal">
                    <h2>Editar mascota</h2>

                    <form onSubmit={guardarEdicion}>
                        <label>Nombre</label>
                        <input type="text" value={editNombre} onChange={cambiarEditNombre} required />

                        <label>Raza</label>
                        <input type="text" value={editRaza} onChange={cambiarEditRaza} required />

                        <label>Nueva foto (opcional)</label>
                        <input type="file" accept="image/*" onChange={cambiarEditFoto} />

                        <div className="modal-botones">
                            <button type="button" className="btn-cancelar" onClick={cerrarEdicion}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-guardar">
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Aviso para usuarios sin permiso
    function mostrarAviso() {
        if (esAdmin === true) {
            return null;
        }
        return (
            <p className="aviso-permiso">
                Tu rol es USUARIO: solo puedes ver las mascotas. No puedes agregar, editar ni eliminar.
            </p>
        );
    }

    // Clase y estado de los controles según el rol
    let claseFormulario = 'form-mascota';
    let bloqueado = true;
    if (esAdmin === true) {
        bloqueado = false;
    } else {
        claseFormulario = 'form-mascota bloqueado';
    }

    // ---------- PANTALLA ----------
    return (
        <div className="gestion">
            <h1>Gestión de Mascotas</h1>

            <button type="button" className="btn-volver" onClick={volverAlPerfil}>
                Volver al perfil
            </button>

            {mostrarAviso()}

            <form className={claseFormulario} onSubmit={guardarMascota}>
                <input type="text" placeholder="Nombre" value={nombre} onChange={cambiarNombre} disabled={bloqueado} required />
                <input type="text" placeholder="Raza" value={raza} onChange={cambiarRaza} disabled={bloqueado} required />
                <input type="file" accept="image/*" onChange={cambiarFoto} disabled={bloqueado} required />
                <button type="submit" disabled={bloqueado}>Guardar</button>
            </form>

            <p className="mensaje">{mensaje}</p>

            <ListaMascotas
                mascotas={mascotas}
                version={version}
                esAdmin={esAdmin}
                onEditar={abrirEdicion}
                onEliminar={eliminarMascota}
            />

            {mostrarModal()}
        </div>
    );
}

export default GestionMascotas;