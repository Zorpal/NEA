import React, {useContext, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import ApplicantContext from '../context/ApplicantContext';

const Logout = () => {
    const navigate = useNavigate();
    const { updateuserinformation } = useContext(ApplicantContext);
    
    useEffect(()=>{
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        updateuserinformation([])
        navigate('/')
    }, [])

  return (
    <div>Logout</div>
  )
}

export default Logout