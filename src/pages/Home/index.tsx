import React, {useState, useEffect} from 'react'
import {getSearchListCall, search, getdemo} from '../api/index';

const Home = () => {
    const [data, setData] = useState('111')
    
    useEffect(() => {
       getData();
    }, [data]);

    async function getData(){
        // const data = await search();
        const data2 = await getdemo();
    }

    return <div>{'data'}</div>;
}

export default Home;