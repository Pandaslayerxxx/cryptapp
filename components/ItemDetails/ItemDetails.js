import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";
import { auctionAbi } from "../../core/constant";
import { contractAbi } from "../../abi";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import Modal from "react-modal";
import Countdown from "react-countdown";

const initData = {
  itemImg: "/img/auction_2.jpg",
  date: "2022-03-30",
  tab_1: "Bids",
  tab_2: "History",
  tab_3: "Details",
  ownerImg: "/img/avatar_1.jpg",
  itemOwner: "Themeland",
  created: "15 Jul 2021",
  title: "Walking On Air",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum obcaecati dignissimos quae quo ad iste ipsum officiis deleniti asperiores sit.",
  price_1: "1.5 ETH",
  price_2: "$500.89",
  count: "1 of 5",
  size: "14000 x 14000 px",
  volume: "64.1",
  highest_bid: "2.9 BNB",
  bid_count: "1 of 5",
  btnText: "Place a Bid",
};

const tabData_1 = [
  {
    id: "1",
    img: "/img/avatar_1.jpg",
    price: "14 ETH",
    time: "4 hours ago",
    author: "@arham",
  },
  {
    id: "2",
    img: "/img/avatar_2.jpg",
    price: "10 ETH",
    time: "8 hours ago",
    author: "@junaid",
  },
  {
    id: "3",
    img: "/img/avatar_3.jpg",
    price: "12 ETH",
    time: "3 hours ago",
    author: "@yasmin",
  },
];

const tabData_2 = [
  {
    id: "1",
    img: "/img/avatar_6.jpg",
    price: "32 ETH",
    time: "10 hours ago",
    author: "@hasan",
  },
  {
    id: "2",
    img: "/img/avatar_7.jpg",
    price: "24 ETH",
    time: "6 hours ago",
    author: "@artnox",
  },
  {
    id: "3",
    img: "/img/avatar_8.jpg",
    price: "29 ETH",
    time: "12 hours ago",
    author: "@meez",
  },
];

const sellerData = [
  {
    id: "1",
    img: "/img/avatar_1.jpg",
    seller: "@ArtNoxStudio",
    post: "Creator",
  },
  {
    id: "2",
    img: "/img/avatar_2.jpg",
    seller: "Virtual Worlds",
    post: "Collection",
  },
];

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#1c1c1b",
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: "1000",
  },
};

export default function ItemDetails() {
  const [loading, setLoading] = useState(true);

  const [nftData, setNftData] = useState();
  const [coverImage, setCoverImage] = useState();
  const [auction, setAuction] = useState();
  const [account, setAccount] = useState("none");
  const [auctionData, setAuctionData] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [transferAddress, setTransferAddress] = useState("");
  const [transferLoad, setTransferLoad] = useState(false);
  const [sender, setSender] = useState("");
  const [buyModal, setBuyModal] = useState(false);
  const [buyLoading, setBuyLoading] = useState();
  const [auctionLoading, setAuctionLoading] = useState(false);
  const [auctionModal, setAuctionModal] = useState(false);
  const [auctionTime, setAuctionTime] = useState();
  const [highestBid, setHighestBid] = useState();
  const [bidModal, setBidModal] = useState(false);
  const [bidLoader, setBidLoader] = useState(false);
  const [bidAmount, setBidAmount] = useState();
  const [copy, setCopy] = useState("Click to copy");
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawLoader, setWithDrawLoader] = useState(true);
  const [withdrawAmount, setWithDrawAmount] = useState();
  const [imageLoading, setImageLoading] = useState(true);
  const [initialPrice, setInitialPrice] = useState("");
  const [startSaleModal, setStartSaleModal] = useState(false);
  const [startSaleLoader, setStartSaleLoader] = useState();

  const handleClose = () => {
    setModalOpen(false);
  };

  // const handleListItemClick = (value) => {
  //   setModalOpen(true)
  // };

  useEffect(() => {
    console.log("isnide here!");

    const getInfo = async () => {
      axios({
        url: "https://loud-final.herokuapp.com/get_token_info",
        method: "POST",
        data: {
          tokenId: window.location.href.split("/").pop(),
        },
      })
        .then(async (response) => {
          console.log(response.data.nft);
          let auctionAddress = response.data.nft.auction_address;
          setNftData(response.data.nft);
          if (localStorage.getItem("wallet")) {
            setAccount(localStorage.getItem("wallet"));
          }

          if (response.data.nft.on_auction) {
            axios({
              url: "https://loud-final.herokuapp.com/get_auction_details",
              method: "POST",
              data: {
                auction_address: auctionAddress,
              },
            })
              .then(async (res) => {
                console.log(res.data.auction, "this is res");
                var currentTime = Math.floor(Date.now() / 1000);
                const timer = (res.data.auction.end_time - currentTime) * 1000;
                console.log(timer, "this is timer!");
                setAuctionTime(timer);
                // console.log(date);
                setAuctionData(res.data.auction);
                setLoading(false);
              })
              .catch((e) => console.log(e));
          }
          setLoading(false);

          //   console.log(localStorage.getItem("wallet"));
        })
        .catch((e) => console.log(e));
    };
    getInfo();
  }, []);

  function refreshPage() {
    window.location.reload(false);
  }

  const buyNft = async () => {
    console.log("we are here!");
    setBuyLoading(true);
    if (window.ethereum) {
      console.log("inisde here");
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);

      const accounts = await window.web3.eth.getAccounts();

      let total_price = parseFloat(nftData.initial_price) + 0.001;

      console.log(total_price, "this is total price");

      window.web3.eth
        .sendTransaction({
          from: accounts[0],
          to: "0x9B45d32E89De016319A32Ccb281E3915b2114F53",
          value: window.web3.utils.toWei(total_price.toString(), "ether"),
        })
        .on("transactionHash", function (hash) {
          console.log(hash, "money sent");
        })
        .on("receipt", function (receipt) {
          console.log(receipt, "this is receipt");

          axios({
            method: "POST",
            url: "https://loud-final.herokuapp.com/transfer_nft",
            data: {
              toAddress: accounts[0],
              fromAddress: nftData.owned_by,
              tokenId: window.location.href.split("/").pop(),
              initial_price: nftData.initial_price,
              creator: nftData.created_by,
              music: nftData.music,
              cover_image: nftData.cover_image,
              royalty: nftData.royalty,
            },
          })
            .then((res) => {
              console.log(res, "afterBuying");
              alert("succesffulluy purchased!");
              window.location.reload();
            })
            .catch((e) => console.log(e));
        });
    }
  };
  const transferNft = async () => {
    setTransferLoad(true);
    if (sender === "") {
      alert("to address cant be empty");
      setTransferLoad(false);
      return;
    }

    if (transferLoad) {
      alert("Please wait.. transaction under progress!");
      return;
    }

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);

      const accounts = await window.web3.eth.getAccounts();

      window.contract = await new window.web3.eth.Contract(
        contractAbi,
        "0xC27CA64B9E42b60cf92AA365457d3d9DB214566C"
      );

      const send = await window.contract.methods
        .transferFrom(
          accounts[0],
          sender,
          window.location.href.split("/").pop()
        )
        .send({ from: accounts[0] })
        .on("transactionHash", function (hash) {
          console.log(hash, "this is tranfer hash");
          axios({
            method: "POST",
            url: "https://loud-final.herokuapp.com/update_nft_history",
            data: {
              tokenId: window.location.href.split("/").pop(),
              newOwner: sender,
              currentOwner: accounts[0],
              txHash: hash,
            },
          }).then((res) => {
            if (res.data === "success") {
              // setTransferLoading()

              // console.log(send, "this is send");
              // console.log(currentUser, "this is currentUser");
              alert("successfully transfered!");
              setTransferLoad(false);
              refreshPage();
            }
          });
        });
    }
  };

  const startAuction = async () => {
    setAuctionLoading(true);

    console.log(nftData.auction_address, "this is it!");

    if (nftData.auction_address && nftData.auction_address !== "") {
      alert("Pending auctions Detected!");

      window.location.reload();
      return;
    }
    // setAuctionStatus("Deploying Auction Contract!");
    if (window.ethereum) {
      console.log("inisde here");
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      const accounts = await window.web3.eth.getAccounts();
      const finalTime = parseInt(auctionTime);

      var _biddingTime = finalTime * 60 * 60;
      // console.log(_biddingTime);
      // return;
      var _beneficiary = "0x9B45d32E89De016319A32Ccb281E3915b2114F53";
      var simpleauctionContract = new window.web3.eth.Contract(auctionAbi);
      console.log();
      if (!nftData.transfer) {
        // setAuctionStatus("Tranfering to Auction");

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
          console.log(
            window.location.href.split("/").pop(),
            "this is token Id"
          );

          const theOwner = await window.contract.methods
            .approve(
              "0x9B45d32E89De016319A32Ccb281E3915b2114F53",
              window.location.href.split("/").pop()
            )
            .send({ from: accounts[0] })
            .on("transactionHash", function (hash) {
              console.log(hash, "this is approved hash");
              // setAuctionStatus("Deploying Auction");
            });
        }
      }

      var startAuctionHash = "";

      var simpleauction = simpleauctionContract
        .deploy({
          data: "0x60806040526000600660006101000a81548160ff0219169083151502179055503480156200002c57600080fd5b5060405162000c9a38038062000c9a8339818101604052810190620000529190620000e4565b6000600281905550806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508142620000a891906200012b565b60018190555050506200022e565b600081519050620000c781620001fa565b92915050565b600081519050620000de8162000214565b92915050565b60008060408385031215620000fe57620000fd620001f5565b5b60006200010e85828601620000cd565b92505060206200012185828601620000b6565b9150509250929050565b60006200013882620001bc565b91506200014583620001bc565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200017d576200017c620001c6565b5b828201905092915050565b600062000195826200019c565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600080fd5b620002058162000188565b81146200021157600080fd5b50565b6200021f81620001bc565b81146200022b57600080fd5b50565b610a5c806200023e6000396000f3fe60806040526004361061007b5760003560e01c80633ccfd60b1161004e5780633ccfd60b146101095780634b449cba1461013457806391f901571461015f578063d57bde791461018a5761007b565b80631998aeef1461008057806326b387bb1461008a5780632a24f46c146100c757806338af3eed146100de575b600080fd5b6100886101b5565b005b34801561009657600080fd5b506100b160048036038101906100ac9190610643565b610369565b6040516100be91906107ef565b60405180910390f35b3480156100d357600080fd5b506100dc610381565b005b3480156100ea57600080fd5b506100f36104b4565b6040516101009190610730565b60405180910390f35b34801561011557600080fd5b5061011e6104d8565b60405161012b9190610774565b60405180910390f35b34801561014057600080fd5b506101496105fc565b60405161015691906107ef565b60405180910390f35b34801561016b57600080fd5b50610174610602565b6040516101819190610715565b60405180910390f35b34801561019657600080fd5b5061019f610628565b6040516101ac91906107ef565b60405180910390f35b600660009054906101000a900460ff1615610205576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101fc906107cf565b60405180910390fd5b6004543411610249576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610240906107af565b60405180910390fd5b6000600454146102ce5760045460056000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546102c6919061081b565b925050819055505b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503460048190555060026000815480929190610329906108cb565b91905055507fdfea07ab8527bd08519bfa633240757a7bb0a7f3c7adc98e30604ba73c70f429333460405161035f92919061074b565b60405180910390a1565b60056020528060005260406000206000915090505481565b600660009054906101000a900460ff16156103d1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103c89061078f565b60405180910390fd5b6001600660006101000a81548160ff0219169083151502179055507fdaec4582d5d9595688c8c98545fdd1c696d41c6aeaeb636737e84ed2f5c00eda600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660045460405161044192919061074b565b60405180910390a160008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004549081150290604051600060405180830381858888f193505050501580156104b1573d6000803e3d6000fd5b50565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600080600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060008111156105f3576000600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050506105f25780600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060009150506105f9565b5b60019150505b90565b60015481565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b60008135905061063d81610a0f565b92915050565b60006020828403121561065957610658610943565b5b60006106678482850161062e565b91505092915050565b61067981610883565b82525050565b61068881610871565b82525050565b61069781610895565b82525050565b60006106aa60318361080a565b91506106b582610948565b604082019050919050565b60006106cd60268361080a565b91506106d882610997565b604082019050919050565b60006106f0601d8361080a565b91506106fb826109e6565b602082019050919050565b61070f816108c1565b82525050565b600060208201905061072a600083018461067f565b92915050565b60006020820190506107456000830184610670565b92915050565b6000604082019050610760600083018561067f565b61076d6020830184610706565b9392505050565b6000602082019050610789600083018461068e565b92915050565b600060208201905081810360008301526107a88161069d565b9050919050565b600060208201905081810360008301526107c8816106c0565b9050919050565b600060208201905081810360008301526107e8816106e3565b9050919050565b60006020820190506108046000830184610706565b92915050565b600082825260208201905092915050565b6000610826826108c1565b9150610831836108c1565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561086657610865610914565b5b828201905092915050565b600061087c826108a1565b9050919050565b600061088e826108a1565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006108d6826108c1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561090957610908610914565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600080fd5b7f5468652066756e6374696f6e2061756374696f6e456e6465642068617320616c60008201527f7265616479206265656e2063616c6c6564000000000000000000000000000000602082015250565b7f546865726520697320616c7265616479206120686967686572206f722065717560008201527f616c206269640000000000000000000000000000000000000000000000000000602082015250565b7f5468652061756374696f6e2068617320616c726561647920656e646564000000600082015250565b610a1881610871565b8114610a2357600080fd5b5056fea26469706673582212202b0d48b05bb61e348a689a6aeed94ecd8f4847f084fb34826c71efc7e76d2feb64736f6c63430008070033",
          arguments: [_biddingTime, _beneficiary],
        })
        .send({
          from: accounts[0],
          gas: "4700000",
        })
        .on("transactionHash", function (hash) {
          console.log(hash, "money sent");
          startAuctionHash = hash;
        })
        .on("receipt", async function (receipt) {
          console.log(receipt, "this is receipt");
          window.contract = await new window.web3.eth.Contract(
            auctionAbi,
            receipt.contractAddress
          );

          const endtTime = await window.contract.methods
            .auctionEndTime()
            .call()
            .then((res) => {
              axios({
                method: "POST",
                url: "https://loud-final.herokuapp.com/create_auction",
                data: {
                  contractAddress: receipt.contractAddress,
                  endTime: res,
                  tokenId: window.location.href.split("/").pop(),
                  address: accounts[0],
                  txHash: startAuctionHash,
                },
              });
            })
            .then((res) => {
              console.log(res, "endt time da");
              alert("auction started");
              window.location.reload();
              // setAuctionStatus("Auction Started!");
            });
        });
    }
  };

  const sendBid = async () => {
    console.log(parseInt(bidAmount), "this is currentBid");
    console.log(typeof currentBid, "this is type");
    setBidLoader(true);

    if (bidAmount < parseFloat(nftData.initial_price)) {
      alert("Cannot Place bid: Bid amount Lower than item price");
      setBidLoader(false);
      return;
    }

    // setBidModalLoader(true);
    if (window.ethereum) {
      console.log("inisde here haha");
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      const accounts = await window.web3.eth.getAccounts();

      window.contract = await new window.web3.eth.Contract(
        auctionAbi,
        nftData.auction_address
      );
      // var etherAmount = window.web3.utils.toBN(parseInt(currentBid));
      // var weiValue = window.web3.utils.toWei(etherAmount, "ether");
      // console.log(weiValue, "this is weiValue");
      let biddingPrice = parseFloat(bidAmount) * 1000000000000000000;
      if (parseFloat(auctionData.highest_bid) >= biddingPrice) {
        alert("Bid higher");
        return;
      }

      var bidHash = "";
      const startBidding = await window.contract.methods
        .bid()
        .send({
          from: accounts[0],
          gas: 470000,
          value: biddingPrice,
        })
        .on("transactionHash", function (hash) {
          console.log(hash, "money sent");
          bidHash = hash;
        })
        .on("receipt", function (receipt) {
          console.log(receipt, "this is receipt");
          // alert("succesffully deposited");
          // bidModal(false);
          axios({
            method: "POST",
            url: "https://loud-final.herokuapp.com/create_bid",
            data: {
              from: receipt.from,
              bidAmount: bidAmount,
              auction_address: nftData.auction_address,
              txHash: bidHash,
            },
          }).then((res) => {
            alert("successfully placed Bid!");
            window.location.reload();
            // setBidModalLoader(false);
          });
        });
    }
  };

  const endAuction = async () => {
    // alert("auction has ended");
    //write logic for auction ending

    console.log(auctionData, "this is auction Data");
    setLoading(true);
    if (window.ethereum) {
      console.log("inisde here haha");
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      const accounts = await window.web3.eth.getAccounts();

      window.contract = await new window.web3.eth.Contract(
        auctionAbi,
        auctionData.contract_address
      );
      const highestBid = await window.contract.methods.highestBid().call();

      const highestBidder = await window.contract.methods
        .highestBidder()
        .call();
      console.log(highestBid, highestBidder, "lol");

      const endAuction = await window.contract.methods
        .auctionEnd()
        .send({
          from: accounts[0],
          gas: 470000,
        })
        .on("transactionHash", function (hash) {
          console.log(hash, "money sent");
          axios({
            method: "POST",
            url: "https://loud-final.herokuapp.com/end_auction",
            data: {
              highestBid: highestBid,
              highestBidder: highestBidder,
              auctionAddress: auctionData.contract_address,
              auctionCreator: nftData.owned_by,
              tokenId: window.location.href.split("/").pop(),
              royalty: nftData.royalty,
              creator: nftData.created_by,
            },
          })
            .then((endres) => {
              console.log(endres, "auction ended");
              setNftData(endres.data.nft);
              setLoading(false);
            })
            .catch((e) => alert("some error occurred"));
        });
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopy("Copied");
  };

  const openWithdraw = async () => {
    setWithdrawModal(true);
    if (window.ethereum) {
      console.log("inisde here haha");
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      const accounts = await window.web3.eth.getAccounts();

      window.contract = await new window.web3.eth.Contract(
        auctionAbi,
        nftData.auction_address
      );
      const returns = await window.contract.methods
        .pendingReturns(accounts[0])
        .call();

      console.log(returns, "returns");
      if (returns === "0") {
        setWithDrawAmount(0);
        alert("You dont have any amount to withdraw");
        window.location.reload();
      } else {
        setWithDrawAmount(parseFloat(returns) / 1000000000000000000);
        setWithDrawLoader(false);
      }
    }
  };
  const withDraw = async () => {
    setWithDrawLoader(true);
    if (window.ethereum) {
      console.log("inisde here haha");
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      const accounts = await window.web3.eth.getAccounts();

      window.contract = await new window.web3.eth.Contract(
        auctionAbi,
        nftData.auction_address
      );
      const returns = await window.contract.methods
        .withdraw()
        .send({
          from: accounts[0],
          gas: "4700000",
        })
        .on("transactionHash", function (hash) {
          console.log(hash, "money sent");

          axios({
            url: "https://loud-final.herokuapp.com/bid_withdraw",
            method: "POST",
            data: {
              auctionAddress: nftData.auction_address,
              user: accounts[0],
            },
          })
            .then((res) => {
              alert("successfully withdrawn");
              window.location.reload();
            })
            .catch((e) => alert("some error occurred"));
        });
    }
  };

  const stopSale = () => {
    setLoading(true);
    axios({
      method: "POST",
      url: "https://loud-final.herokuapp.com/stop_nft_sale",
      data: {
        tokenId: window.location.href.split("/").pop(),
      },
    })
      .then((res) => {
        setLoading(false);
        alert("Sale stopped");
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const startSale = async () => {
    setLoading(true);
    setBidModal(false);
    var currentAccount;
    if (window.ethereum) {
      console.log("inisde here haha");
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      const accounts = await window.web3.eth.getAccounts();
      currentAccount = accounts[0];

      console.log(accounts[0], "this is the account!");
    }

    console.log(currentAccount, "this is current account");
    // return;

    if (nftData.transfer) {
      axios({
        method: "POST",
        url: "https://loud-final.herokuapp.com/start_nft_sale",
        data: {
          tokenId: window.location.href.split("/").pop(),
          user: currentAccount,
          initialPrice: initialPrice,
        },
      })
        .then((res) => {
          console.log(res, "this is res");
          setLoading(false);
          alert("Sale Started");
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
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

        const theOwner = await window.contract.methods
          .approve(
            "0x9B45d32E89De016319A32Ccb281E3915b2114F53",
            window.location.href.split("/").pop()
          )
          .send({ from: accounts[0] })
          .on("transactionHash", function (hash) {
            console.log(hash, "this is approve hash");
            axios({
              method: "POST",
              url: "https://loud-final.herokuapp.com/start_nft_sale",
              data: {
                tokenId: window.location.href.split("/").pop(),
                user: currentAccount,
                initialPrice: initialPrice,
              },
            })
              .then((res) => {
                setLoading(false);
                alert("Sale Started");
                window.location.reload();
              })
              .catch((e) => {
                console.log(e);
              });
          });
      }
    }
  };
  return (
    <div>
      {loading ? (
        <div style={{ height: "80vh" }}>
          <center>
            <div class="fa-3x mt-5 pt-5">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
          </center>
        </div>
      ) : (
        <section className="item-details-area">
          {/* start sale modal */}
          <Modal
            isOpen={startSaleModal}
            // onAfterOpen={afterOpenModal}
            // onRequestClose={() => setModalOpen(false)}
            style={customStyles}
            contentLabel="Example Modal"
          >
            {startSaleLoader ? (
              <center style={{ width: "32vw", height: "32vh" }}>
                <div class="fa-3x mt-5 pt-5">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </center>
            ) : (
              <div style={{ width: "32vw", height: "32vh" }}>
                <div
                  style={{
                    fontSize: "28px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>Start Sale </div>
                  <div
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => setStartSaleModal(false)}
                  >
                    x
                  </div>
                </div>
                <div>
                  <div></div>
                  <div className="pt-5">
                    {/* <label>
                      Enter Bid amount (Greater than current bidding amount)
                    </label> */}
                    Instant Sale Price:
                    <input onChange={(e) => setInitialPrice(e.target.value)} />
                  </div>

                  <div
                    className="d-block btn btn-bordered-white mt-5"
                    onClick={() => startSale()}
                  >
                    Start Sale
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* withdraw modal */}
          <Modal
            isOpen={withdrawModal}
            // onAfterOpen={afterOpenModal}
            // onRequestClose={() => setModalOpen(false)}
            style={customStyles}
            contentLabel="Example Modal"
          >
            {withdrawLoader ? (
              <center style={{ width: "32vw", height: "32vh" }}>
                <div class="fa-3x mt-5 pt-5">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </center>
            ) : (
              <div style={{ width: "32vw", height: "22vh" }}>
                <div
                  style={{
                    fontSize: "28px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>Withdraw </div>
                  <div
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => setBidModal(false)}
                  >
                    x
                  </div>
                </div>
                <div>
                  <div></div>
                  <div className="pt-5">
                    {/* <label>
                      Enter Bid amount (Greater than current bidding amount)
                    </label> */}
                    Withdraw Amount: {withdrawAmount + " BNB"}
                  </div>

                  <div
                    className="d-block btn btn-bordered-white mt-5"
                    onClick={() => withDraw()}
                  >
                    Withdraw
                  </div>
                </div>
              </div>
            )}
          </Modal>
          {/* bid modal */}
          <Modal
            isOpen={bidModal}
            // onAfterOpen={afterOpenModal}
            // onRequestClose={() => setModalOpen(false)}
            style={customStyles}
            contentLabel="Example Modal"
          >
            {bidLoader ? (
              <center style={{ width: "32vw", height: "32vh" }}>
                <div class="fa-3x mt-5 pt-5">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </center>
            ) : (
              <div style={{ width: "32vw", height: "42vh" }}>
                <div
                  style={{
                    fontSize: "28px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>Bid Now</div>
                  <div
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => setBidModal(false)}
                  >
                    x
                  </div>
                </div>
                <div>
                  <div>
                    <h4>
                      Current Highest Bid:{" "}
                      {auctionData
                        ? auctionData.highest_bid === ""
                          ? "0 BNB"
                          : auctionData.highest_bid + "BNB"
                        : ""}
                    </h4>
                  </div>
                  <div className="pt-5">
                    <label>
                      Enter Bid amount (Greater than current bidding amount and
                      greater than item price if no bids avaialble)
                    </label>
                    <input
                      placeholder="Ex: 0.1 BNB"
                      style={{ width: "100%", marginTop: "10px" }}
                      type="number"
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                  </div>

                  <div
                    className="d-block btn btn-bordered-white mt-5"
                    onClick={() => sendBid()}
                  >
                    Bid Now
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* auction modal */}
          <Modal
            isOpen={auctionModal}
            // onAfterOpen={afterOpenModal}
            // onRequestClose={() => setModalOpen(false)}
            style={customStyles}
            contentLabel="Example Modal"
          >
            {auctionLoading ? (
              <center style={{ width: "32vw", height: "32vh" }}>
                <div class="fa-3x mt-5 pt-5">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </center>
            ) : (
              <div style={{ width: "32vw", height: "32vh" }}>
                <div
                  style={{
                    fontSize: "28px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>Auction</div>
                  <div
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => setAuctionModal(false)}
                  >
                    x
                  </div>
                </div>
                <div>
                  <div className="pt-5">
                    <label>Enter Auction End Time(in hours)</label>
                    <input
                      placeholder="Ex: 5hrs"
                      style={{ width: "100%", marginTop: "10px" }}
                      type="number"
                      onChange={(e) => setAuctionTime(e.target.value)}
                    />
                  </div>
                  <div
                    className="d-block btn btn-bordered-white mt-5"
                    onClick={() => startAuction()}
                  >
                    Start Auction
                  </div>
                </div>
              </div>
            )}
          </Modal>
          {/* this is buyModal */}
          <Modal
            isOpen={buyModal}
            // onAfterOpen={afterOpenModal}
            // onRequestClose={() => setModalOpen(false)}
            style={customStyles}
            contentLabel="Example Modal"
          >
            {buyLoading ? (
              <center style={{ width: "32vw", height: "32vh" }}>
                <div class="fa-3x mt-5 pt-5">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </center>
            ) : (
              <div style={{ width: "32vw", height: "32vh" }}>
                <div
                  style={{
                    fontSize: "28px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>Buy Now</div>
                  <div
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => setBuyModal(false)}
                  >
                    x
                  </div>
                </div>
                <div>
                  <div className="pt-5 d-flex justify-content-between">
                    <div> Initial price:</div>
                    <div> {nftData.initial_price + "  BNB"}</div>
                  </div>
                  <div
                    className="pt-2 d-flex justify-content-between pb-2"
                    style={{ borderBottom: "1px solid white" }}
                  >
                    <div> Transfer price:</div>
                    <div> {0.01 + "  BNB"}</div>
                  </div>
                  <div className="pt-2 d-flex justify-content-between pb-2">
                    <div> Total:</div>
                    <div> {parseFloat(nftData.initial_price) + 0.01}BNB</div>
                  </div>
                  <div
                    className="d-block btn btn-bordered-white mt-4"
                    onClick={() => buyNft()}
                  >
                    Buy
                  </div>
                </div>
              </div>
            )}
          </Modal>
          <Modal
            isOpen={shareModal}
            // onAfterOpen={afterOpenModal}
            onRequestClose={() => setShareModal(false)}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div style={{ width: "600px", color: "white" }}>
              <h4>Share</h4>
              <a
                href={window.location.href}
                // style={{ width: "200px", backgroundColor: "red" }}
              >
                {window.location.href}
              </a>

              <center onClick={copyText} className="mt-5">
                <div className="d-block btn btn-bordered-white ">{copy}</div>
              </center>
            </div>
          </Modal>
          <Modal
            isOpen={transferModal}
            // onAfterOpen={afterOpenModal}
            onRequestClose={() => setModalOpen(false)}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div style={{ width: "32vw", height: "32vh" }}>
              {transferLoad ? (
                <div>
                  <center>
                    <div class="fa-3x mt-5 pt-5">
                      <i class="fas fa-spinner fa-spin"></i>
                    </div>
                  </center>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: "28px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ color: "white", fontWeight: "bold" }}>
                      Transfer Token
                    </div>
                    <div
                      style={{ cursor: "pointer", color: "white" }}
                      onClick={() => setTransferModal(false)}
                    >
                      x
                    </div>
                  </div>
                  <div className="pt-5">Enter Transfer Address:</div>
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Transfer Address"
                    style={{
                      background: "none",
                      padding: "24px",
                    }}
                    onChange={(e) => setSender(e.target.value)}
                  />
                  <div
                    className="d-block btn btn-bordered-white mt-5"
                    onClick={() => transferNft()}
                  >
                    Transfer Token
                  </div>
                </>
              )}
            </div>
          </Modal>
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-12 col-lg-5">
                <div className="item-info">
                  <div className="item-thumb text-center">
                    {imageLoading ? (
                      <div class="fa-3x mt-5 pt-5">
                        <i class="fas fa-spinner fa-spin"></i>
                      </div>
                    ) : (
                      ""
                    )}

                    <img
                      src={nftData.cover_image}
                      alt=""
                      onLoad={() => setImageLoading(false)}
                    />
                  </div>
                  <div className="card no-hover countdown-times my-4">
                    <ReactAudioPlayer
                      src={nftData.music}
                      // autoPlay
                      controls
                      style={{ width: "100%" }}
                    />
                  </div>
                  {/* Netstorm Tab */}
                  <ul className="netstorm-tab nav nav-tabs" id="nav-tab">
                    <li>
                      <a
                        className="active"
                        id="nav-home-tab"
                        data-toggle="pill"
                        href="#nav-home"
                      >
                        <h5 className="m-0">{initData.tab_1}</h5>
                      </a>
                    </li>
                    <li>
                      <a
                        id="nav-profile-tab"
                        data-toggle="pill"
                        href="#nav-profile"
                      >
                        <h5 className="m-0">{initData.tab_2}</h5>
                      </a>
                    </li>
                    {/* <li>
                      <a
                        id="nav-contact-tab"
                        data-toggle="pill"
                        href="#nav-contact"
                      >
                        <h5 className="m-0">{initData.tab_3}</h5>
                      </a>
                    </li> */}
                  </ul>
                  {/* Tab Content */}
                  <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-home">
                      <ul className="list-unstyled">
                        {/* Single Tab List */}
                        {nftData.on_auction ? (
                          <div>
                            {auctionData ? (
                              auctionData.bidders.length > 0 ? (
                                <>
                                  {" "}
                                  {auctionData.bidders.map((item, idx) => {
                                    return (
                                      <li
                                        key={`tdo_${idx}`}
                                        className="single-tab-list d-flex align-items-center"
                                      >
                                        <img
                                          className="avatar-sm rounded-circle mr-3"
                                          src="https://image.flaticon.com/icons/png/512/1203/1203435.png"
                                          alt=""
                                        />
                                        <p className="m-0">
                                          Bid listed for{" "}
                                          <strong>{item.amount}</strong>{" "}
                                          {item.time} <br />
                                          by{" "}
                                          <a
                                            href={`/artist/${item.bidder_address}`}
                                          >
                                            {item.bidder_address.slice(0, 6) +
                                              "..."}
                                          </a>
                                        </p>
                                      </li>
                                    );
                                  })}
                                </>
                              ) : (
                                <div className="mt-4">No data</div>
                              )
                            ) : (
                              <div className="mt-4">No data</div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-4">No data</div>
                        )}
                      </ul>
                    </div>
                    <div className="tab-pane fade" id="nav-profile">
                      <ul className="list-unstyled">
                        {/* Single Tab List */}
                        {nftData.tx_history.map((item, idx) => {
                          return (
                            <li
                              key={`tdt_${idx}`}
                              className="single-tab-list d-flex align-items-center"
                            >
                              <img
                                className="avatar-sm rounded-circle mr-3"
                                src={
                                  item.selling_type === "Minting"
                                    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREg3xlaYCTTZx54R4EJIUfcls3C_JjJUUInQ&usqp=CAU"
                                    : item.selling_type !== "Auction"
                                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Transfer-left_right.svg/758px-Transfer-left_right.svg.png"
                                    : "https://image.freepik.com/free-vector/sold-out-price-tag-sign_123447-162.jpg"
                                }
                                alt=""
                              />
                              {item.selling_type === "auction" ? (
                                <p className="m-0">
                                  Nft sold in auction for{" "}
                                  <strong>
                                    {parseFloat(item.sold_for) /
                                      1000000000000000000}
                                  </strong>
                                  {" BNB"}
                                  {item.time} <br />
                                  {/* by <a href="/author">{item.author}</a> */}
                                </p>
                              ) : item.selling_type !== "Minting" ? (
                                <div>
                                  <p className="m-0">
                                    Nft Transfered from{" "}
                                    <a href={`/artist/${item.from}`}>
                                      <strong>
                                        {item.from.slice(0, 6) + "..."}
                                      </strong>
                                    </a>
                                    <br />
                                  </p>
                                </div>
                              ) : (
                                <p className="m-0">
                                  Token Minted by{" "}
                                  <a href={`/artist/${item.to}`}>
                                    <strong>
                                      {item.to.slice(0, 6) + "..."}
                                    </strong>
                                  </a>
                                  <br />
                                  {/* by <a href="/author">{item.author}</a> */}
                                </p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                {/* Content */}
                <div className="content mt-5 mt-lg-0">
                  <h3 className="m-0">{nftData.name}</h3>
                  <p>{nftData.description}</p>
                  {/* Owner */}
                  <div className="owner d-flex align-items-center">
                    <span>Owned By</span>
                    <a
                      className="owner-meta d-flex align-items-center ml-3"
                      href={`/artist/${nftData.owned_by}`}
                    >
                      <img
                        className="avatar-sm rounded-circle"
                        src={
                          nftData.owner_image === ""
                            ? "data:image/jpeg;base64,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"
                            : nftData.owner_image
                        }
                        alt=""
                      />
                      <a href={`/artist/${nftData.owned_by}`}>
                        {" "}
                        <h6 className="ml-2">
                          {nftData.owned_by.slice(0, 8) + "..."}
                        </h6>
                      </a>
                    </a>
                  </div>
                  {/* Item Info List */}
                  <div className="item-info-list mt-4">
                    <ul className="list-unstyled">
                      <li className="price d-flex justify-content-between">
                        <span>
                          Current Price {nftData.initial_price + " BNB"}
                        </span>
                        {/* <span>{initData.price_2}</span>
                        <span>{initData.count}</span> */}
                      </li>
                      <li>
                        {/* <span>Size </span>
                        <span>{initData.size}</span> */}
                      </li>
                      <li>
                        {/* <span>Volume Traded </span>
                        <span>{initData.volume}</span> */}
                      </li>
                    </ul>
                  </div>
                  <div className="row items">
                    <div className="col-12  item px-lg-2">
                      <div className="card no-hover">
                        <div className="single-seller d-flex align-items-center">
                          {nftData.owned_by === account.toLowerCase() ? (
                            <div
                              className="d-block btn btn-bordered-white ml-5"
                              onClick={() => setTransferModal(true)}
                            >
                              Transfer
                            </div>
                          ) : (
                            ""
                          )}

                          <div
                            className="d-block btn btn-bordered-white ml-5"
                            onClick={() => setShareModal(true)}
                          >
                            Share
                          </div>
                          {!nftData.on_auction ? (
                            nftData.auction_address ? (
                              nftData.auction_address !== "" ? (
                                <div
                                  className="d-block btn btn-bordered-white ml-5"
                                  onClick={() => openWithdraw()}
                                >
                                  Withdraw
                                </div>
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}

                          {/* <a href="/author">
                            <img
                              className="avatar-md rounded-circle"
                              src={
                                nftData.creator_image === ""
                                  ? "data:image/jpeg;base64,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"
                                  : nftData.creator_image
                              }
                              alt=""
                            />
                          </a> */}
                          {/* Seller Info */}
                          {/* <div className="seller-info ml-3">
                            <a className="seller mb-2" href="/author">
                              {nftData.created_by.slice(0, 6) + ".."}
                            </a>
                        
                          </div> */}
                        </div>
                      </div>
                    </div>

                    {nftData.on_auction ? (
                      <div className="col-12 item px-lg-2">
                        <div className="card no-hover">
                          <h4 className="mt-0 mb-2">
                            {auctionTime ? (
                              Date.now() + auctionTime < Date.now() ? (
                                "Auction Ended"
                              ) : (
                                <Countdown date={Date.now() + auctionTime} />
                              )
                            ) : (
                              "..."
                            )}
                          </h4>
                          <div className="price d-flex justify-content-between align-items-center">
                            <span>{"Highest Bid"}</span>
                            <span>
                              {auctionData
                                ? auctionData.highest_bid === ""
                                  ? "No bids"
                                  : auctionData.highest_bid
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {nftData.owned_by.toLowerCase() === account.toLowerCase() ? (
                    nftData.on_auction ? (
                      <div>
                        {Date.now() + auctionTime < Date.now() ? (
                          <div
                            className="d-block btn btn-bordered-white mt-4"
                            onClick={() => endAuction()}
                          >
                            End auction
                          </div>
                        ) : (
                          <div
                            className="d-block btn btn-bordered-white mt-4"
                            onClick={() => endAuction()}
                          >
                            Stop auction
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div
                          className="d-block btn btn-bordered-white mt-4"
                          onClick={() => setAuctionModal(true)}
                        >
                          Start Auction
                        </div>
                      </div>
                    )
                  ) : nftData.on_auction ? (
                    <div>
                      {Date.now() + auctionTime < Date.now() ? (
                        ""
                      ) : (
                        <div
                          className="d-block btn btn-bordered-white mt-4"
                          onClick={() => setBidModal(true)}
                        >
                          Place a bid
                        </div>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {nftData.owned_by.toLowerCase() === account.toLowerCase() ? (
                    nftData.on_sale ? (
                      <div>
                        <div
                          className="d-block btn btn-bordered-white mt-4"
                          onClick={() => stopSale()}
                        >
                          Stop Sale
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          className="d-block btn btn-bordered-white mt-4"
                          onClick={() => setStartSaleModal(true)}
                        >
                          Start Sale
                        </div>
                      </div>
                    )
                  ) : nftData.on_sale ? (
                    <div>
                      <div
                        className="d-block btn btn-bordered-white mt-4"
                        onClick={() => setBuyModal(true)}
                      >
                        Buy Now
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
