import React, { useEffect, useState } from "react";
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ProfileService } from "../../service/profile";
import dayjs from "dayjs";
import { CLOUDINARY } from "../../service/_api";
import ModalChangePassword from "../Modal/modal.change-password";

export default function AccountProfile() {

  const [profile, setProfile] = useState({} as any);
  const [imageCloud, setImageCloud] = useState('')
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false)

  const handleOpenModalChangePassword = () => {
    setOpenModalChangePassword(true);
  }

  const uploadImageToCloudinary = async (file: File) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "kiotfpt");
    formdata.append("folder", "kiotfpt");
    fetch(CLOUDINARY, {
      method: "POST",
      body: formdata,
      redirect: "follow"
    })
      .then((response) => response.text())
      .then((result) => {
        const data = JSON.parse(result);
        setImageCloud(data.secure_url);
      })
      .catch((error) => error);
  }

  const handleChangeDate = (newValue: any) => {
    const date = dayjs(newValue).format("YYYY-MM-DD");
    setProfile({ ...profile, birthday: date });
  };

  const handleSave = async () => {
    const payload = {
      birthday: profile?.birthday,
      email: profile?.email,
      id: profile?.id,
      name: profile?.name,
      phone: profile?.phone,
      thumbnail: imageCloud === '' ? profile?.thumbnail : imageCloud,
    }
    const res = await ProfileService.updateProfile(payload);
    if (res?.result) {
      window.location.reload();
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await ProfileService.getProfile();
      if (data?.result) {
        setProfile(data?.data);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="w-full box-border pb-40">
      <div style={{
        position: 'fixed',
        top: '150px',
        right: '20px',
        zIndex: 10,
        width: '300px',
      }}>
      </div>
      <ModalChangePassword open={openModalChangePassword} setOpen={setOpenModalChangePassword} initialData={{}} />
      <h1 className="font-semibold text-[20px] py-4">Account Information</h1>
      <div className="w-full flex border rounded-lg shadow-md">
        <div className="w-3/5 flex flex-col gap-6 p-4">
          <div className="w-full bg-[rgb(var(--quaternary-rgb))] py-2 pl-4 box-border rounded-md text-white">
            <h1 className="text-[16px] font-semibold">Personal Information</h1>
          </div>
          <div className="flex w-full gap-x-2 justify-between items-center">
            <div className="w-full cursor-pointer flex justify-start items-center gap-8">
              <img src={profile?.thumbnail} alt="avatar" className="rounded-full w-20 h-20" />
              <input
                type="file"
                onChange={(e: any) => {
                  const file = e.target.files[0]
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setProfile({ ...profile, thumbnail: reader.result as string });
                  }
                  reader.readAsDataURL(file)
                  uploadImageToCloudinary(file)
                }}
              />
            </div>
          </div>
          <div className="w-full box-border flex font-medium items-center">
            <h1 className="w-1/5">Fullname</h1>
            <TextField
              value={profile?.name}
              className="w-4/5"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setProfile({ ...profile, name: event.target.value });
              }}
            />
          </div>
          <div className="w-full flex font-medium items-center">
            <h1 className="w-1/5">Birthday</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DatePicker format="YYYY/MM/DD" value={dayjs(profile?.birthday)} onChange={(newValue) => handleChangeDate(newValue)} />
            </LocalizationProvider>
          </div>
          <div className="w-full flex font-medium items-center">
            <h1 className="w-1/5">Email</h1>
            <TextField
              value={profile?.email}
              className="w-4/5"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setProfile({ ...profile, email: event.target.value });
              }}
            />
          </div>
          <div className="w-full flex font-medium items-center">
            <h1 className="w-1/5">Phone</h1>
            <TextField
              value={profile?.phone}
              className="w-4/5"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setProfile({ ...profile, phone: event.target.value });
              }}
            />
          </div>
          <div className="w-full flex font-medium items-center">
            <div className="w-1/5"></div>
            <div className="w-4/5">
              <button onClick={handleSave} className="bg-[rgb(var(--primary-rgb))] font-semibold py-2 px-16 rounded-md text-white">
                SAVE
              </button>
            </div>
          </div>
        </div>
        <div className="w-2/5 flex flex-col gap-6 p-4">
          <div>
            <div className="w-full bg-[rgb(var(--quaternary-rgb))] py-2 pl-4 box-border rounded-md text-white">
              <h1 className="text-[16px] font-semibold">Security</h1>
            </div>
            <div className="flex justify-between pt-5">
              <div className="flex gap-x-2 items-center">
                <LockIcon />
                <div>
                  <h1 className="font-medium">Change password</h1>
                </div>
              </div>
              <div>
                <button onClick={handleOpenModalChangePassword} className="text-[rgb(var(--quaternary-rgb))] border border-[rgb(var(--quaternary-rgb))] rounded-md py-1 px-4 font-medium">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
