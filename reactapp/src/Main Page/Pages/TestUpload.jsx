import { storage } from "../../Firebase";
import React, {useState} from "react";
import { ref, uploadBytes } from "firebase/storage";

function TestUpload(){
    const [imageUpload, setImageUpload] = useState(null);
    const handleInputChange = (e) => {
        setImageUpload(e.target.files[0])
    }
    const uploadImages = () => {
        if(imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name}`)
        uploadBytes(imageRef, imageUpload).then(() => {
            alert("Image uploaded!");
        })
    }
    return (
        <>
        <input type="file" onChange={handleInputChange} />
        <button onClick={uploadImages}>Upload</button>
        </>
    );
}
export default TestUpload;