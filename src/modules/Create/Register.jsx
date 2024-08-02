import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Register.css'

const Register = () => {
    //Fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [name, setName] = useState("");
    const [nick, setNick] = useState("");
    //Fields State
    const [emailState, setEmailState] = useState("");
    const [passwordState, setPasswordState] = useState([]);
    const [repeatPasswordState, setRepeatPasswordState] = useState("");
    const [nameState, setNameState] = useState("");
    const [nickState, setNickState] = useState("");
    const [registerState, setRegisterState] = useState("");

    const navigate = useNavigate();
    const registerURL = "https://gamefeed-back.onrender.com/api/users/register/";

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/");
        }
    }, [])

    const checkPasswords = () => {
        if (password !== repeatPassword) {
            setRepeatPasswordState("No coinciden las contraseñas");
        } else {
            setRepeatPasswordState("");
        }
    }

    const checkEmailFormat = () => {
        const emailCheckList = [
            "Tiene que tener al menos 6 caracteres",
            "No es un formato correcto de email"
        ]

        const validationRegex = [
            { regex: /.{6,}/ },
            { regex: /[@]/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(email);

            if (!isValid) {
                actualCheckList.push(emailCheckList[i])
            }
        })

        setEmailState(actualCheckList);
    };

    const checkPassSecurity = () => {
        const passwordChecklist = [
            "Tiene que tener al menos 6 caracteres",
            "Debe incluir al menos 1 numero",
            "Debe incluir al menos 1 letra minuscula",
            "Debe incluir al menos 1 letra mayuscula",
            "Deve incluir al menos 1 caracter especial"
        ]

        const validationRegex = [
            { regex: /.{6,}/ },
            { regex: /[0-9]/ },
            { regex: /[a-z]/ },
            { regex: /[A-Z]/ },
            { regex: /[^A-Za-z0-9]/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(password);

            if (!isValid) {
                actualCheckList.push(passwordChecklist[i])
            }
        })

        setPasswordState(actualCheckList);
    };

    const checkNameFormat = () => {
        const nameCheckList = [
            "Tiene que tener al menos 3 caracteres",
            "Debe incluir al menos 1 letra minuscula"
        ]

        const validationRegex = [
            { regex: /.{3,}/ },
            { regex: /[a-z]/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(name);

            if (!isValid) {
                actualCheckList.push(nameCheckList[i])
            }
        })

        setNameState(actualCheckList);
    }

    const checkNickFormat = () => {
        const nickCheckList = [
            "El campo no puede estar vacio"
        ]

        const validationRegex = [
            { regex: /.{1,}/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(nick);

            if (!isValid) {
                actualCheckList.push(nickCheckList[i])
            }
        })

        setNickState(actualCheckList);
    };

    const register = async (e) => {
        e.preventDefault();
        setEmailState([]);
        setPasswordState([]);
        setNameState([]);
        setNickState([]);

        checkEmailFormat();
        checkPassSecurity();
        checkNameFormat();
        checkNickFormat();
        checkPasswords();

        if (emailState.length === 0 && passwordState.length === 0 && repeatPasswordState.length === 0 && nameState.length === 0 && nickState.length === 0) {
            const payload = {
                email,
                password,
                name,
                nick
            }

            const response = await axios.post(registerURL, payload);
            const registerStatus = response.data.estado;
            setRegisterState(registerStatus);
        }
    }

    return (
        <div className="register">
            <h2 className="register--tittle">Formulario de registro</h2>
            <h4 className="register--info">No podras iniciar sesión hasta que la cuenta sea aprobada por un administrador</h4>
            {!registerState ?
                <form className="register--form" onSubmit={register}>
                    <div className="register--formPair">
                        <label htmlFor="newuserEmail">Email</label>
                        <input id="newuserEmail" type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    {emailState &&
                        <ul>
                            {emailState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="newuserPass">Contraseña</label>
                        <input id="newuserPass" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    {passwordState &&
                        <ul>
                            {passwordState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="repeatNewUserPass">Repite la contraseña</label>
                        <input id="repeatNewUserPass" type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}></input>
                    </div>
                    {repeatPasswordState && <p className="register--formError">{repeatPasswordState}</p>}
                    <div className="register--formPair">
                        <label htmlFor="newuserName">Name</label>
                        <input id="newuserName" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                    </div>
                    {nameState &&
                        <ul>
                            {nameState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="newuserNick">Nick</label>
                        <input id="newuserNick" type="text" value={nick} onChange={(e) => setNick(e.target.value)}></input>
                    </div>
                    {nickState &&
                        <ul>
                            {nickState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <button className="register--formButton" type="submit">Registrarse</button>
                </form>
                :
                <p>{registerState}</p>}
        </div>
    )
}

export default Register;