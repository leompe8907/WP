import './newUser.css'
import { CV } from '../../cv/cv'
import { useState } from 'react';

const hcId = "hc01241175";
    
    const changePass = (newPass, code)=>{
        CV.call(
            "resetSubscriberPassword",
            {
                code: code,
                newPass: newPass,
                hash: false
            },
            (result)=>{
                if(result["success"]){
                    alert("la contraseña se seteo correctamente");
                }else{
                    alert("Sucedio un error seteando la nueva contraseña de "+ code+ ": "+ result['errorMessage']);
                }
            }
        );
    };    
    const add = (apiNewUserName, apiNewUserEmail, apiNewUserPass)=>{
        const code = apiNewUserName.replace(/\s+/g, '');
        CV.call(
            "addSubscriber",
            {
                subscriber:{
                    code: code,
                    hcId: hcId,
                    firstName: apiNewUserName,
                    countryCode:"AR",
                    contact : {
                        contactId : 1, 
                        type: "EMail", 
                        contact: apiNewUserEmail                      
                    }
                }
            },
            (result)=>{
                if(result["success"]){
                    alert("El usuario se ha agregado correctamente");
                    changePass(apiNewUserPass, code);
                }else{
                    alert("Failed to fetch result: "+result['errorMessage']);
                }
            }
        );
    };
    export const NewUser = () => {
        
        
        const [newUserName, setNuewUserName] = useState("");
        const [newUserPhone, setNuewUserPhone] = useState("");
        const [newUserEmail, setNuewUserEmail] = useState("");
        const [newUserPass, setNuewUserPass] = useState("");
        //const [newUserState, setNuewUserState] = useState("");
        
        const valid_inputs = ()=>{
            if(newUserName.length == 0){
                alert("'" + newUserName + "' is not a valid user name.")
                return false;
            } 
            if(newUserPass.length < 8 || newUserPass.includes('.')){
                alert("Invalid password. It must contain at least 8 alphanumeric characters")
                return false;
            } 
            if(newUserEmail.length == 0 | !newUserEmail.includes('@') | !newUserEmail.includes('.')){
                alert("'" +newUserEmail+ "' is not a valid email. Please try again")
                return false; 
            }
            return true
        }
        const resetInputs = ()=>{

        }
        const handleNewUser = async (event)=>{
            event.preventDefault();
            if(valid_inputs()){
                add(newUserName, newUserEmail, newUserPass);
                setNuewUserName("");
                setNuewUserEmail("");
                setNuewUserPhone("");
                setNuewUserPass("");
                
            }
        }

  return (
    <div className='newUser'>
        <h1 className="newUserTitle">Nuevo Usuario</h1>
        <form className="newUserForm">
            <div className="newUserItem">
                <label>User Name</label>
                <input type="text" placeholder='marian89' name='userNmae' id='userName' className="newUserInput" onChange={(event)=>setNuewUserName(event.target.value)} value = {newUserName}/>
            </div>
            <div className="newUserItem">
                <label>Phone</label>
                <input type="text" placeholder='+541136744424' name='Phone' id='Phone' className="newUserInput" onChange={(event)=>setNuewUserPhone(event.target.value)} value = {newUserPhone}/>
            </div>
            <div className="newUserItem">
                <label>Email</label>
                <input type='email' placeholder='yo@yo.yo' name='Email' id='Email' className="newUserInput" onChange={(event)=>setNuewUserEmail(event.target.value)} value = {newUserEmail}/>
            </div>
            <div className="newUserItem">
                <label>Password</label>
                <input type='text' placeholder='123panaccess321' name='Password' id='Password' className="newUserInput" onChange={(event)=>setNuewUserPass(event.target.value)} value = {newUserPass}/>
            </div>
           
            <div className='newUserButtonContainer'>
                <button className="newUserButton" onClick={handleNewUser}>Crear</button>
            </div>
        </form>
    </div>
  )
}
