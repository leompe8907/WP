import './userlist.scss'
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import userImg from '../../resources/imgs/opiece.jpg'
import { CV } from '../../cv/cv'
import { useEffect, useState } from 'react';
import {Trow} from '../../classUtils'

let buscarRows = true;
  const cvUser = "nbr_sw4";
  const cvPass = "Sw4network321!";
  const cvToken = "pXzfslHEHzrududyAXLz";

  function loginFailed(reason) {
    console.log(reason);
  }

  const getRows = (listOfSubscribers, records)=>{
    let rows = [];
    for(let i = 0; i<records; i++){
      rows.push(new Trow(i+1, listOfSubscribers[i].cell[0], listOfSubscribers[i].cell[2], listOfSubscribers[i].cell[5], userImg));
    }
    return rows;
  }
  
  export const UserList = () => {
      
      const [data, setData] = useState(null);
      function loggedIn() {
          getList();
        }
        const onWindowLoad = ()=>{
            CV.init({
                baseUrl: "https://cv01.panaccess.com",
                mode: "json",
                jsonpTimeout: 5000,
                username: cvUser,
                password: cvPass,
                apiToken: cvToken,
                loginSuccessCallback: loggedIn,
                loginFailedCallback: loginFailed
              });
          }
      
      function getList(){
        CV.call(
          "getListOfSubscribers",
          {
            offset: 0,
            limit: 900
          },
          (result)=>{
            if (result['success']){
              let answer = result['answer'];
              setData(getRows(answer.rows, answer.records));
            }else{
              alert("Failed to fetch result: "+result['errorMessage']);
            }
    
          }
        );
      }
    
      function deleteUser(userCode, id){
        CV.call(
          "deleteSubscriber",
          {
            code:userCode
          },
          (result)=>{
            if (result['success']){
              setData(data.filter((item)=>item.id !== id));
              alert("Successfull delete of subscriber");
            }else{
              alert("Failed to delete user: "+result['errorMessage']);
            }
    
          }
        );
      }
      
    const handleDelete = (id)=>{
      if(window.confirm("What you are trying to do cannot be undone. Do you want to procede?")){
        const element = data.find((row)=>row.id === id);
        deleteUser(element.code, id);
      }
    }
    useEffect(()=>{
        if(buscarRows){
            onWindowLoad();
            buscarRows = false;
        }
    })
    const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'userName', headerName: 'User Name', width: 200, renderCell: (params)=>{
        return(
            <>
                <div className="userListName">
                    <img src={params.row.avatar} alt=''/>
                    {params.row.userName}
                </div>
            </>
        )
    }},
    { field: 'code', headerName: 'Code', width: 200 },
    {
        field: 'hcName',
        headerName: 'hcName',
        width: 200
    },
    {
        field: 'plan',
        headerName: 'Plan',
        width: 130
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 130,
        renderCell: (params)=>{
            return(
                <>
                    <Link to={"/users/" + params.row.id}>
                        <button className="userListEditButton">Editar</button>
                    </Link>
                    <DeleteOutline className='deleteUserActionButton' onClick = {()=>handleDelete(params.row.id)}/>
                </>
            )
        }
    },
  ];

  return (
    <div className='userList'>
        <DataGrid
        rows={data}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
  </div>
  )
}