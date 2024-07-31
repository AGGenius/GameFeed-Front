import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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
    const registerURL = "http://localhost:3000/api/users/register/";

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
        <>
            {!registerState ?
                <form onSubmit={register}>
                    <label htmlFor="newuserEmail">Email</label>
                    <input id="newuserEmail" type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    {emailState &&
                        <ul>
                            {emailState.map((value, i) =>
                            (
                                <li key={i}>{value}</li>
                            ))}
                        </ul>}
                    <label htmlFor="newuserPass">Contraseña</label>
                    <input id="newuserPass" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    {passwordState &&
                        <ul>
                            {passwordState.map((value, i) =>
                            (
                                <li key={i}>{value}</li>
                            ))}
                        </ul>}
                    <label htmlFor="repeatNewUserPass">Repite la contraseña</label>
                    <input id="repeatNewUserPass" type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}></input>
                    {repeatPasswordState && <p>{repeatPasswordState}</p>}
                    <label htmlFor="newuserName">Name</label>
                    <input id="newuserName" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                    {nameState &&
                        <ul>
                            {nameState.map((value, i) =>
                            (
                                <li key={i}>{value}</li>
                            ))}
                        </ul>}
                    <label htmlFor="newuserNick">Nick</label>
                    <input id="newuserNick" type="text" value={nick} onChange={(e) => setNick(e.target.value)}></input>
                    {nickState &&
                        <ul>
                            {nickState.map((value, i) =>
                            (
                                <li key={i}>{value}</li>
                            ))}
                        </ul>}
                    <button type="submit">Registrarse</button>
                </form>
                :
                <p>{registerState}</p>}
        </>
    )
}

export default Register;