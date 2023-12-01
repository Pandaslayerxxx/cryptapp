import React, { useState, useEffect } from "react";
import AuthorProfile from "../AuthorProfile/AuthorProfile";
import Web3 from "web3";
import { contractAbi } from "../../abi";
import axios from "axios";
import ReactDOM from "react-dom";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import { useHistory } from "react-router";
import { storage, db } from "../../firebase";
import WalletConnectProvider from "@walletconnect/web3-provider";

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

export default function Create() {
  const [nftName, setNftName] = useState("");
  const [file, setFile] = useState();
  const [royalty, setRoyalty] = useState();
  const [onSale, setOnSale] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialPrice, setIntialPrice] = useState();
  const [tokenId, setTokenId] = useState("");
  const [txHash, setTxHash] = useState("");
  const [nftMessage, setNftMessage] = useState("Loading...");
  const [image, setImage] = useState();
  const [imageLoading, setImageLoading] = useState();
  const [progress, setProgress] = useState();

  const history = useHistory();

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

  useEffect(() => {
    axios({
      method: "POST",
      url: "https://loud-final.herokuapp.com/get_user_details",
      data: {
        user: localStorage.getItem("wallet"),
      },
    }).then((res) => {
      if (res.data.is_verified) {
        setLoading(false);
      } else {
        alert("You are not authorized to mint NFTS!! Contact Admin.");
        history.push("/create");
      }
    });
  }, []);

  const createNewNft = async (assetHash, metaDataURI, contract_address) => {
    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);

      const accounts = await window.web3.eth.getAccounts();

      window.contract = await new window.web3.eth.Contract(
        contractAbi,
        "0xC27CA64B9E42b60cf92AA365457d3d9DB214566C"
      );

      let result;

      console.log(metaDataURI, "this is metaDatauri");

      console.log(royalty, "this is royalty");

      const mynewNumber = await window.contract.methods
        .createCollectible(metaDataURI, royalty)
        .send({ from: accounts[0] })
        .on("transactionHash", function (hash) {
          console.log(hash, "this is awardItem hash");
        })
        .on("receipt", function (receipt) {
          result = receipt;
          console.log(receipt, "this is award Item receipt");
        });

      console.log(mynewNumber, "this is my new number");

      return result;
    } else {
      const provider = new WalletConnectProvider({
        // infuraId: "22b3a9c2b68f42abb593b0582461ed6d",
        rpc: {
          97: "https://speedy-nodes-nyc.moralis.io/58179be7c4a9b63cf4bac6a5/bsc/testnet",
        },
      });
      const web3 = new Web3(provider);

      await provider.enable();

      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        contractAbi,
        "0xC27CA64B9E42b60cf92AA365457d3d9DB214566C"
      );

      let result;
      var balance = await web3.eth.getBalance(accounts[0]);

      console.log("this is bal", balance);

      console.log(contract.methods, "this is windpw contract");

      console.log(metaDataURI, "this is metaDatauri");

      console.log(royalty, "this is royalty");

      const mynewNumber = await contract.methods
        .createCollectible(metaDataURI, royalty)
        .send({ from: accounts[0] })
        .on("transactionHash", function (hash) {
          console.log(hash, "this is awardItem hash");
        })
        .on("receipt", function (receipt) {
          result = receipt;
          console.log(receipt, "this is award Item receipt");
        });

      console.log(mynewNumber, "this is my new number");

      return result;
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setNftMessage("Creating Nft Please wait..!!");
    setLoading(true);

    // return;

    let creator;
    let token_created_id;

    // console.log(file, name, description);
    console.log(file, "this is on Sale");
    if (
      file === "" ||
      nftName === "" ||
      description === "" ||
      coverImage === ""
    ) {
      alert("Please Provide Values");
      setLoading(false);
      return;
    }

    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      const accounts = await window.web3.eth.getAccounts();
      creator = accounts[0];
    }

    // setVisible(true);
    // handleClickOpen();
    // return;

    const formData = new FormData();
    formData.append("myImage", file);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("https://loud-final.herokuapp.com/upload", formData, config)
      .then((res) => {
        // console.log(res, "this the first response!");
        const myData = {
          name: nftName,
          creator: creator,
          description: description,
          imagePath: res.data,
          cover: coverImage,
          type: "Music",
          royalty: royalty,
          initialPrice: initialPrice,
        };
        axios({
          method: "POST",
          url: "https://loud-final.herokuapp.com/create_meta_data",
          data: myData,
        })
          .then(async (res) => {
            const nft = await createNewNft(
              res.data.imageHash,
              res.data.metaDataURI,
              "0xC27CA64B9E42b60cf92AA365457d3d9DB214566C"
            );

            setTokenId(nft.events.Transfer.returnValues.tokenId);
            token_created_id = nft.events.Transfer.returnValues.tokenId;
            setTxHash(nft.transactionHash);
            let myNftMusic = `https://ipfs.io/ipfs/${res.data.imageHash}`;

            const myData = {
              owner: nft.from,
              tokenId: nft.events.Transfer.returnValues.tokenId,
              txHash: nft.transactionHash,
              initialPrice: initialPrice,
              music: myNftMusic,
              onSale: onSale,
              coverImage: coverImage,
              name: nftName,
              ownerImage: localStorage.getItem("profile_image"),
              creatorImage: localStorage.getItem("profile_image"),
              description: description,
              royalty: royalty,
            };
            console.log(nft.from);
            console.log(myData, "myData");
            axios({
              method: "POST",
              url: "https://loud-final.herokuapp.com/add_token_info",
              data: myData,
            })
              .then(async (res) => {
                console.log("inisde here after add token info", res);
                if (res.data) {
                  if (onSale) {
                    console.log("putting on sale");
                    // setCurrentHeading("Putting on Sale");
                    if (window.ethereum) {
                      console.log("inisde here haha");
                      await window.ethereum.send("eth_requestAccounts");
                      window.web3 = new Web3(window.ethereum);
                      // const accounts = await window.ethereum.request({
                      //   method: "eth_requestAccounts",
                      // });
                      const accounts = await window.web3.eth.getAccounts();

                      window.contract = await new window.web3.eth.Contract(
                        contractAbi,
                        "0xC27CA64B9E42b60cf92AA365457d3d9DB214566C"
                      );
                      console.log(token_created_id, "this is token Id");

                      // axios({
                      //   url:"http://localhost:5000/get"
                      // })

                      const theOwner = await window.contract.methods
                        .approve(
                          "0x9B45d32E89De016319A32Ccb281E3915b2114F53",
                          token_created_id
                        )
                        .send({ from: accounts[0] })
                        .on("transactionHash", function (hash) {
                          console.log(hash, "this is approve hash");
                          // setCurrentHeading("Done");
                          setNftMessage(
                            `Nft Created Successfully.. Your tokenId: ${token_created_id}`
                          );
                          history.push(`/item-details/${res.data.tokenId}`);
                          // setLoading(false);
                        });
                    }
                  } else {
                    setNftMessage(
                      `Nft Created Successfully.. Your tokenId: ${token_created_id}`
                    );
                    history.push(`/item-details/${res.data.tokenId}`);
                    // setCurrentHeading("Minted successfully");
                    // setLoading(false);
                  }
                }
              })
              .catch((e) => {
                console.log(e, "this is error");
                alert("some error occurred!!");
              });
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
            setCoverImage(url);
            console.log(url, "this is url");
            setImageLoading(false);
          });
      }
    );
  };
  return (
    <section className="author-area">
      {loading ? (
        <div style={{ height: "60vh" }}>
          <center>
            <div style={{ paddingTop: "150px" }}>{nftMessage}</div>
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
                    <h3 className="mt-3 mb-0">Create Item</h3>
                  </div>
                </div>
                {/* Item Form */}

                <form className="item-form card no-hover">
                  <div className="row">
                    <div className="col-12">
                      <div className=" form-group">
                        <div className="custom-file">
                          <div className="pb-2">Upload Song (MP3, WAV)</div>
                          <input
                            type="file"
                            name="myImage"
                            className=""
                            style={{ marginBottom: "20px" }}
                            id="inputGroupFile01"
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                          {/* <label
                            className="custom-file-label"
                            htmlFor="inputGroupFile01"
                          >
                            Upload Song
                          </label> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group mt-3">
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="Item Name"
                          required="required"
                          onChange={(e) => setNftName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          name="textarea"
                          placeholder="Description"
                          cols={30}
                          rows={3}
                          defaultValue={""}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          placeholder="Item Price"
                          required="required"
                          onChange={(e) => setIntialPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-control"
                          name="royality"
                          placeholder="Royality"
                          required="required"
                          onChange={(e) => setRoyalty(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <div className="pb-2 pt-2 d-flex align-items-center">
                          <div>Upload Cover Image</div>
                          {imageLoading ? (
                            <div className="fa-2x pl-2">
                              <i className="fas fa-spinner fa-spin"></i>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <input
                          type="file"
                          name="myImage"
                          className=""
                          id="inputGroupFile01"
                          onChange={(e) => uploadImage(e.target.files[0])}
                        />
                      </div>
                    </div>
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
                    <div className="col-12">
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
                            Put on Sale
                          </label>
                        </div>
                        {/* <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio2"
                        defaultValue="option2"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio2"
                      >
                        Instant Sale Price
                      </label>
                    </div> */}
                        {/* <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio3"
                        defaultValue="option3"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio3"
                      >
                        Unlock Purchased
                      </label>
                    </div> */}
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn w-100 mt-3 mt-sm-4"
                        type="submit"
                        onClick={(e) => onFormSubmit(e)}
                      >
                        Create Item
                      </button>
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
}
