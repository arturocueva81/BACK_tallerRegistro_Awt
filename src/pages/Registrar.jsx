import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

function Registrar() {
    const [usuario, setUsuario] = useState("");
    const [clave, setClave] = useState("");
    const [rol, setRol] = useState("USER");
    const [mensaje, setMensaje] = useState("");
    const [exito, setExito] = useState("");
    const navigate = useNavigate();

    function cambiarUsuario(evento) {
        setUsuario(evento.target.value);
    }

    function cambiarClave(evento) {
        setClave(evento.target.value);
    }

    function cambiarRol(evento) {
        setRol(evento.target.value);
    }

    async function registrar(evento) {
        evento.preventDefault();

        let datos = {
            username: usuario,
            password: clave,
            rol: rol
        };

        try {
            let respuesta = await fetch(API_BASE_URL + "/auth/registrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            if (respuesta.ok) {
                setExito("Usuario registrado correctamente. Redirigiendo al login...");
                setMensaje("");
                setTimeout(function () {
                    navigate("/login");
                }, 2000);
            } else {
                setMensaje("Error al registrar. El usuario ya puede estar registrado.");
                setExito("");
            }
        } catch (error) {
            setMensaje("No se pudo conectar con el servidor: " + error.message);
            setExito("");
        }
    }

    return (
        <div className="pantalla">
            <div className="panel-izquierdo">
                <h1>Refugio Patitas al Rescate</h1>
                <h2>Crea una cuenta para acceder al sistema.</h2>
            </div>

            <div className="panel-derecho">
                <h2>Crear Cuenta</h2>

                <form onSubmit={registrar}>
                    <div className="campo">
                        <label>Nombre de usuario</label>
                        <input type="text" value={usuario} onChange={cambiarUsuario} />
                    </div>

                    <div className="campo">
                        <label>Contraseña</label>
                        <input type="password" value={clave} onChange={cambiarClave} />
                    </div>

                    <div className="campo">
                        <label>Rol</label>
                        <select value={rol} onChange={cambiarRol}>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <p className="mensaje-error">{mensaje}</p>
                    <p className="mensaje-exito">{exito}</p>

                    <button type="submit" className="btn-primary">Registrarse</button>
                </form>

                <p className="auth-link">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
}

export default Registrar;
