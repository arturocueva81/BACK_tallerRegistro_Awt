import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

function Perfil() {
    const [datos, setDatos] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    let rol = localStorage.getItem("rol");
    let clasePerfil;

    if (rol === "ADMIN" || rol === "ROLE_ADMIN") {
        clasePerfil = "panel-admin";
    } else {
        clasePerfil = "panel-user";
    }

    useEffect(function () {
        let token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch(API_BASE_URL + "/auth/perfil", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(function (respuesta) {
                if (respuesta.ok) {
                    return respuesta.text();
                } else {
                    throw new Error("No autorizado");
                }
            })
            .then(function (texto) {
                setDatos(texto);
            })
            .catch(function (error) {
                setMensaje("No se pudo cargar el perfil: " + error.message);
            });
    }, [navigate]);

    function cerrarSesion() {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        navigate("/login");
    }

    function irAGestion() {
        navigate("/gestion");
    }

    return (
        <div className="pantalla">
            <div className={"panel-izquierdo " + clasePerfil}>
                <h1>Refugio Patitas al Rescate</h1>
                <h2>Bienvenido al sistema.</h2>
            </div>

            <div className="panel-derecho">
                <h2>Mi Perfil</h2>

                <p className="mensaje-error">{mensaje}</p>

                <div className="perfil-info">
                    <p>{datos}</p>
                </div>

                <button className="btn-primary" onClick={irAGestion}>
                    Gestionar Mascotas
                </button>

                <button className="btn-primary" onClick={cerrarSesion}>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}


export default Perfil;
