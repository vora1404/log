import React, { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { LineChart, BarChart, Bar, Legend, Tooltip, CartesianGrid, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const datas = [
    {
      "name": "Page A",
      "pv": 2400
    },
    {
      "name": "Page B",
      "pv": 1398
    },
    {
      "name": "Page C",
      "pv": 9800
    },
    {
      "name": "Page D",
      "pv": 3908
    },
    {
      "name": "Page E",
      "pv": 4800
    },
    {
      "name": "Page F",
      "pv": 3800
    },
    {
      "name": "Page G",
      "pv": 4300
    }
  ]

  console.log(datas)


export default function Chart() {

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [data, setData] = useState([]);
	useEffect(() => {
	  UsersGet()
	}, [])
	
	const UsersGet = () => {
	  fetch("http://localhost:3333/totaljobs")
		.then(res => res.json())
		.then(
		  (result) => {
			setData(result)
		  }
		)
	}
  console.log(data)

  return (
    <React.Fragment>
    
      <Title>งาน</Title>
      <ResponsiveContainer>
        <BarChart width={25} height={25} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="officername" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}