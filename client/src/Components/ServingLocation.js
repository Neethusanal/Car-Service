import React, { useEffect, useState } from 'react'
import { getAllLocations } from '../Services/AdminApi'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../Services/UserApi'
import { updateUserLocation } from '../Redux/UserSlice'


export const ServingLocation = () => {
    const user = useSelector((state) => state.user)
    console.log(user,"fggg")
    
    const [email,setEmail]=useState()
    const [locData,setLocData]=useState()
    const [locationName, setLocationName] = useState(user?.servicelocation);
    const dispatch = useDispatch();
    useEffect(()=>{
        getAllLocations().then((res)=>{
            setLocData(res.data.result)
        })
        setEmail(user.email)
        
    },[])
    useEffect(() => {
      if (user) {
        setLocationName(user?.servicelocation);
      }
    }, [user]);
    const handleChange = (e) => {
      const selectedLocationId = e.target.value;
      const selectedLocation = locData.find((loc) => loc._id === selectedLocationId);
      
      setLocationName(selectedLocationId);
      
      dispatch(updateUserLocation(selectedLocationId)); // Update user location in Redux store
      
      updateUser({ email: user.email, locationName: selectedLocationId }).then((res) => {
        console.log(res.data);
      });
    };
      
      
      

  return (
    <>  
        <div className="mb-2">
          
          <select
            id="items"
            value={locationName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            
            {locData?.map((loc, index) => {
              return (
                <option  key={index}  value={loc._id}>{loc. Locationname}</option>
              )
            })}
          </select>
        </div>
       </>
  )
}
