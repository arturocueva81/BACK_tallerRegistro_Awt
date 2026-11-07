import { useEffect, useState } from 'react';
import API_BASE_URL from '../config/apiConfig';

function TarjetaMascota(props) {
    const mascota = props.mascota;
    const [urlFoto, setUrlFoto] = useState('');

    // Pide la foto al backend y la convierte en una URL para mostrarla
    useEffect(function () {
        async function cargarFoto() {
            try {
                const respuesta = await fetch(
                    API_BASE_URL + '/auth/mascotas/' + mascota.id + '/foto'
                );
                if (respuesta.ok) {
                    const blob = await respuesta.blob();
                    const url = URL.createObjectURL(blob);
                    setUrlFoto(url);
                }
            } catch (error) {
                console.error('Error al cargar la foto', error);
            }
        }

        cargarFoto();
    }, [mascota.id, props.version]);

    function clicEditar() {
        if (props.esAdmin !== true) {
            return;
        }
        props.onEditar(mascota);
    }

    function clicEliminar() {
        if (props.esAdmin !== true) {
            return;
        }
        props.onEliminar(mascota.id);
    }

    // Solo el admin puede usar los botones
    let bloqueado = true;
    if (props.esAdmin === true) {
        bloqueado = false;
    }

    return (
        <div className="tarjeta">
            <img className="tarjeta-foto" src={urlFoto} alt={mascota.nombre} />
            <div className="tarjeta-cuerpo">
                <h3>{mascota.nombre}</h3>
                <p>Raza: {mascota.raza}</p>
                <div className="tarjeta-acciones">
                    <button className="btn-editar" onClick={clicEditar} disabled={bloqueado}>
                        Editar
                    </button>
                    <button className="btn-eliminar" onClick={clicEliminar} disabled={bloqueado}>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

function ListaMascotas(props) {
    if (props.mascotas.length === 0) {
        return <p className="mensaje-vacio">No hay mascotas registradas.</p>;
    }

    const tarjetas = [];

    for (let i = 0; i < props.mascotas.length; i++) {
        const mascota = props.mascotas[i];
        tarjetas.push(
            <TarjetaMascota
                key={mascota.id}
                mascota={mascota}
                version={props.version}
                esAdmin={props.esAdmin}
                onEditar={props.onEditar}
                onEliminar={props.onEliminar}
            />
        );
    }

    return <div className="grid-tarjetas">{tarjetas}</div>;
}

export default ListaMascotas;