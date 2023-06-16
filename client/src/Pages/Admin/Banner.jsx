

import {
  Card, CardHeader, Typography, Button, CardBody, CardFooter, IconButton
} from "@material-tailwind/react";
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import { addBanner, blockBanner, getBanner, unblockBanner } from "../../Services/AdminApi";
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = ["BannerName", "Description ", "Image", , "Action", ""];
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%", // Adjust the maximum width as needed
    width: "400px", // Set a fixed width or use percentage
  },
};

export const Banner = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [bannerName, setBannerName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("")
  const [banner, setBanner] = useState([])

  const [initialstatus, setInitialstatus] = useState(false)



  const navigate = useNavigate()

  useEffect(() => {
    getAllBanners();


  }, [initialstatus]);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  const handleAddBanner = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    formData.append('bannerName', bannerName)
    formData.append('description', description)

    let { data } = await addBanner(formData)
    console.log(data)
    if (data.success) {
      Swal.fire(data.message)
      setBannerName("")
      setDescription("")
      setImage(null)
    }
    else {
      Swal.fire(data.error)
    }

  }
  const getAllBanners = () => {
    console.log("hhhhh")
    getBanner().then((res) => {
      console.log("getBanner");
      console.log(res.data);
      if (res.data.success) {
        console.log(res.data.result, "ddddddd");
        setBanner(res?.data?.result);
      }
    })
  }
  const handleEdit = (bannerdata) => {

    navigate('/admin/editbanner', { state: { bannerdata } })
  }

  const handleBlock = async (bannerdatas) => {
    const id = bannerdatas?._id


    if (bannerdatas?.status) {


      console.log("hiii")
      let { data } = await blockBanner(id)
      console.log(data)
      if (data.success) {
        setInitialstatus(!initialstatus)

        Swal.fire(data.message)
      }
      else {


        Swal.fire(data.message)
      }

    }
    else if (!bannerdatas.status) {
      console.log('iiiiiii')
      let { data } = await unblockBanner(id)
      console.log("hiii" + data)
      if (data?.success) {
        setInitialstatus(!initialstatus)

        Swal.fire(data?.message)
      }
      else {
        Swal.fire(data?.message)
      }
    }
  }

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Banner
              </Typography>

            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max">

              <Button className="flex items-center gap-3" color="blue" size="sm " onClick={openModal}>
                Add Banner
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {banner.map(
                (bannerdata, index) => {
                  const isLast = index === banner.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index}>

                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {bannerdata.bannerName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {bannerdata.description}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <img
                          className="h-14 w-20 rounded-lg shadow-xl shadow-blue-gray-900/50"
                          src={bannerdata.image}
                          alt="nature image"
                        />
                      </td>

                      <td className={`${classes} p-4 md:p-2`}>
                        <Button size="sm" onClick={() => handleEdit(bannerdata)}  > Edit</Button>
                      </td>
                      <td className={`${classes} p-4 md:p-2`}>
                        <Button size="sm" onClick={() => handleBlock(bannerdata)} >
                          {bannerdata?.status ? "UnBlocked" : "Blocked"}
                        </Button>
                      </td>

                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button variant="outlined" color="blue-gray" size="sm">
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <IconButton variant="outlined" color="blue-gray" size="sm">
              1
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              2
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              3
            </IconButton>

          </div>
          <Button variant="outlined" color="blue-gray" size="sm">
            Next
          </Button>
        </CardFooter>
      </Card>
      <div>
        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="text-4xl font-bold flex-items-center">Add Banner</div>
          <form onSubmit={handleAddBanner}>
            <div className="mb-4">
              <label
                htmlFor="brand"
                className="block font-bold mb-1"
              >
                Banner Name
              </label>
              <input
                type="text"
                id="brand"
                value={bannerName}
                onChange={(e) => setBannerName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter banner name"
                required
              />
            </div  >

            <div className="mb-4">
              <label
                htmlFor="brand"
                className="block font-bold mb-1"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter the Description"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="banner" className="block font-bold mb-1">
                Banner Image
              </label>
              <input
                type="file"
                name='file'
                onChange={(e) =>
                  setImage(e.target.files[0])
                }
                className="file-input w-full max-w-xs" required
              />

            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900 false"
            >
              submit
            </button>
            <button
              onClick={closeModal}
              className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900 false"
            >
              close
            </button>
          </form>

        </Modal>
      </div>
    </>
  );
}
