import './App.css';
import {useEffect, useState} from "react";

function App() {

    const [users, setUsers] = useState();

    useEffect(() => {
        const getData = async () => {
            const response = await fetch('/api/users');
            const body = await response.json();
            setUsers(body._embedded.users);
        }
        getData();
    }, [])

    const printUsers = () => {
        if (typeof users != 'undefined') {
            return (Object.keys(users).map(([user, i]) => (
                <p key={i}>Name: {users[user].firstName}</p>
            )));
        } else {
            return '';
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                {printUsers()}
            </header>
        </div>
    );
}

export default App;
