import { useEffect } from "react";
import { useState } from "react";

function Http() {

    const [fetchData, setFetchData] = useState([])
    const [asyncAwait, setAsyncAwait] = useState([])

    /*
      const request = new XMLHttpRequest();
    
      request.addEventListener('readystatechange', () => {
        //console.log(request, request.readyState)
        if (request.readyState === 4 && request.status === 200) {
          console.log(request, request.responseText)
        }
      })
    
      request.open('GET', 'https://jsonplaceholder.typicode.com/todos')
      request.send();
      */

    //fetch api

    const getFetchData = () => {
        fetch('https://jsonplaceholder.typicode.com/todos').then((response) => {
            if (response.status === 200)
                return response.json()
        }).then(data => {
            setFetchData(data)
        }).catch((error) => {
            console.log(error)
        });
    }

    useEffect(() => {
        getFetchData();
    }, []);

    useEffect(() => {
        getAsyncAwaitData();
    }, []);

    const dataFetched = fetchData.slice(0, 10)
    const dataAsynced = asyncAwait.slice(30, 40)

    const getAsyncAwaitData = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos')
            const data = await response.json();
            setAsyncAwait(data)
        } catch (error) {
            alert(error)
        }
    }

    return (
        <>
            <div>
                {dataFetched.map((data =>
                    <div key={data.id}>
                        <h1>{data.title}</h1>
                    </div>
                ))}
            </div>
            <br></br>
            <br></br>
            <div>
                {dataAsynced.map((data =>
                    <div key={data.id}>
                        <h1>{data.title}</h1>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Http
