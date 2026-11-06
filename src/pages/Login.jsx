import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [clave, setClave] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    function cambiarUsuario(evento) {
        setUsuario(evento.target.value);
    }

    function cambiarClave(evento) {
        setClave(evento.target.value);
    }

    async function ingresar(evento) {
        evento.preventDefault();

        let datos = {
            username: usuario,
            password: clave
        };

        try {
            let respuesta = await fetch(API_BASE_URL + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            if (respuesta.ok) {
                let resultado = await respuesta.json();
                localStorage.setItem("token", resultado.token);
                localStorage.setItem("rol", resultado.rol);
                navigate("/perfil");
            } else {
                setMensaje("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            setMensaje("No se pudo conectar con el servidor: " + error.message);
        }
    }

    return (
        <div className="pantalla">
            <div className="panel-izquierdo">
                <h1>Refugio Patitas al Rescate</h1>
                <h2>Sistema de acceso para voluntarios y adoptantes.</h2>
            </div>

            <div className="panel-derecho">
                <h2>Iniciar Sesión</h2>

                <form onSubmit={ingresar}>
                    <div className="campo">
                        <label>Usuario</label>
                        <input type="text" value={usuario} onChange={cambiarUsuario} />
                    </div>

                    <div className="campo">
                        <label>Contraseña</label>
                        <input type="password" value={clave} onChange={cambiarClave} />
                    </div>

                    <p className="mensaje-error">{mensaje}</p>

                    <button type="submit" className="btn-primary">Ingresar</button>
                </form>

                <p className="auth-link">
                    ¿No tienes cuenta? <Link to="/registrar">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
