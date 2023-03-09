import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DataTable from 'react-data-table-component';
import { Link } from "react-router-dom";
import axios from "axios";
import Export from "react-data-table-component"
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';




export default function UserList() {

	const columns = [
		{
			name: 'ID',
			selector: row => row.jobs_id,
			cellExport: row => row.jobs_id,
			sortable: true
		},
		{
			name: 'ปัญหา',
			selector: row => row.jobs_problem,
			cellExport: row => row.jobs_problem,
			sortable: true
		},
		{
			name: 'รายละเอียด',
			selector: row => row.jobs_details,
			cellExport: row => row.jobs_details,
			sortable: true
		},
		{
			name: 'แก้ไข',
			selector: row => row.jobs_fix,
			cellExport: row => row.jobs_fix,
			sortable: true
		},
		{
			name: 'เวลา',
			selector: row => row.jobs_datetime,
			cellExport: row => row.jobs_datetime,
			sortable: true
		},
		{
			name: 'เจ้าหน้าที่',
			selector: row => row.officername,
			cellExport: row => row.officername,
			sortable: true
		}
	];

	const [data, setData] = useState([]);
	useEffect(() => {
	  UsersGet()
	}, [])
	
	const UsersGet = () => {
	  fetch("http://localhost:3333/jobs")
		.then(res => res.json())
		.then(
		  (result) => {
			setData(result)
		  }
		)
	
	}

	const tableData = {
		columns,
		data
	  };

	

	
 

  return (

    <DataTableExtensions {...tableData}>
        <DataTable
          columns={columns}
          data={data}
          noHeader
          defaultSortField="id"
          defaultSortAsc={false}
          pagination
          highlightOnHover
        />
      </DataTableExtensions>

    
  );
}