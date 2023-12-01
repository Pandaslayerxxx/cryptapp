import React, { useState } from "react";
import AuthorProfile from "../AuthorProfile/AuthorProfile";
import Web3 from "web3";
import { contractAbi } from "../../abi";
import axios from "axios";
import ReactDOM from "react-dom";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { storage, db } from "../../firebase";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const SignupNew = () => {
  const [onSale, setOnSale] = useState(false);

  const [loading, setLoading] = useState("");

  const history = useHistory();
  const [profileImage, setProfileImage] = useState("");
  const [image, setImage] = useState();
  const [progress, setProgress] = useState();
  const [imageLoading, setImageLoading] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [telegram, setTelegram] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  //   const []

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const uploadImage = (val) => {
    setImageLoading(true);
    setImage(val);
    const uploadTask = storage.ref(`images/${val.name}`).put(val);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function ...
        storage
          .ref("images")
          .child(val.name)
          .getDownloadURL()
          .then((url) => {
            setProfileImage(url);
            console.log(url, "this is url");
            setImageLoading(false);
          });
      }
    );
  };

  const createNewAccount = async () => {
    setLoading(true);
    if (profileImage === "" || profileName === "" || email === "") {
      alert("Fields cant be empty");
      return;
    }
    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);

      const accounts = await window.web3.eth.getAccounts();

      axios({
        method: "POST",
        url: "https://loud-final.herokuapp.com/create",
        data: {
          user: accounts[0],
          profileName: profileName,
          profileImage: profileImage,
          twitter: twitter,
          instagram: instagram,
          facebook: facebook,
          email: email,
          telegram: telegram,
          bio: bio,
          country: country,
        },
      }).then((res) => {
        localStorage.setItem("wallet", res.data.user);
        localStorage.setItem("profile_image", res.data.profile_image);
        alert("profile created successfully!");
        history.push("/");
      });
    }
  };

  return (
    <section className="author-area">
      {loading ? (
        <div style={{ height: "60vh" }}>
          <center>
            <div class="fa-3x mt-5 pt-5">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
          </center>
        </div>
      ) : (
        <>
          <div className="container">
            <div className="row justify-content-center">
              {/* <div className="col-12 col-md-4">
              Author Profile
              <AuthorProfile />
            </div> */}
              <div className="col-12 col-md-7">
                {/* Intro */}
                <div className="intro mt-5 mt-lg-0 mb-4 mb-lg-5">
                  <div className="intro-content">
                    <span>Get Started</span>
                    <h3 className="mt-3 mb-0">Create Profile</h3>
                  </div>
                </div>
                {/* Item Form */}

                <form className="item-form card no-hover">
                  <div className="row">
                    <div className="col-12">
                      <div className="input-group form-group">
                        <div className="custom-file">
                          <input
                            type="file"
                            name="myImage"
                            className="custom-file-input"
                            id="inputGroupFile01"
                            onChange={(e) => uploadImage(e.target.files[0])}
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="inputGroupFile01"
                          >
                            Profile image
                          </label>
                        </div>
                      </div>
                    </div>
                    {imageLoading ? (
                      <div
                        className="fa-3x"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          margin: "auto",
                        }}
                      >
                        <i className="fas fa-spinner fa-spin"></i>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="col-12">
                      <div className="form-group mt-3">
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="Profile Name"
                          required="required"
                          onChange={(e) => setProfileName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          name="textarea"
                          placeholder="Bio-Description"
                          cols={30}
                          rows={3}
                          defaultValue={""}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group mt-3">
                        <input
                          type="email"
                          className="form-control"
                          name="price"
                          placeholder="Email"
                          required="required"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      {/* <div className="form-group mt-3">
                        <label
                          className="   text-white "
                          htmlFor="inlineRadio1"
                        >
                          social profiles:
                        </label>
                      </div> */}
                    </div>

                    {/* <div className="col-12">
                      <div className="form-group mt-3">
                        <input
                          type="text"
                          className="form-control"
                          name="Instragram"
                          placeholder="Instragram"
                          required="required"
                          onChange={(e) => setInstagram(e.target.value)}
                        />
                      </div>
                    </div> */}
                    {/* <div className="col-12">
                      <div className="form-group mt-3">
                        <input
                          type="text"
                          className="form-control"
                          name="Facebook"
                          placeholder="Facebook"
                          required="required"
                          onChange={(e) => setFacebook(e.target.value)}
                        />
                      </div>
                    </div> */}
                    {/* <div className="col-12">
                      <div className="form-group mt-3">
                        <input
                          type="text"
                          className="form-control"
                          name="Telegram"
                          placeholder="Telegram"
                          required="required"
                          onChange={(e) => setTelegram(e.target.value)}
                        />
                      </div>
                    </div> */}

                    {/* <div className="col-12">
                      <div className="form-group mt-3">
                        <input
                          type="text"
                          className="form-control"
                          name="twitter"
                          placeholder="twitter"
                          required="required"
                          onChange={(e) => setTwitter(e.target.value)}
                        />
                      </div>
                    </div> */}
                    {/* <div className="col-12">
                      <div className="form-group mt-3">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          required="required"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div> */}
                    {/* <div className="col-12 col-md-6">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="copies"
                      placeholder="No of Copies"
                      required="required"
                    />
                  </div>
                </div> */}
                    {/* <div className="col-12">
                      <div className="form-group mt-3">
                        <div className="form-check form-check-inline">
                          <input
                            type="checkbox"
                            style={{ marginRight: "10px" }}
                            onChange={(e) => StereoPannerNode(!onSale)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio1"
                          >
                            accept (terms and conditions) - privacy-terms
                          </label>
                        </div>
                      </div>
                    </div> */}

                    {/* <div className="col-12">
                      <div className="form-group mt-3">
                        <div className="form-check form-check-inline">
                          <input
                            type="checkbox"
                            style={{ marginRight: "10px" }}
                            onChange={(e) => setOnSale(!onSale)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio1"
                          >
                            submit for verfification
                          </label>
                        </div>
                      </div>
                    </div> */}
                    <div className="col-12">
                      {/* <button
                        className="btn w-100 mt-3 mt-sm-4"
                        type="submit"
                        onClick={(e) => onFormSubmit(e)}
                      >
                        submit for verfification
                      </button> */}
                      <div onClick={() => createNewAccount()}>
                        <button className="btn w-100 mt-3 mt-sm-4">
                          Create Account
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default SignupNew;
