import { useEffect, useState } from "react";
import Button from "./Button";
import Grid from "./Grid";
import axios from "axios";
import "./App.css"
function Upload() {
  const [photos, setPhotos] = useState([]);
  const [updateUI, setUpdateUI] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/get")
      .then((res) => {
        console.log(res.data);
        setPhotos(res.data);
      })
      .catch((err) => console.log(err));
  }, [updateUI]);

  return (
    <div className="App">
      <Grid photos={photos} />
      <Button setUpdateUI={setUpdateUI} />
    </div>
  );
}

export default Upload;
