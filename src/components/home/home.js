import React, { useEffect, useState } from "react";
import abiDecoder from "abi-decoder";
import { Buffer } from "buffer";
import Web3 from "web3";
import { ICU, BEP20, USDT } from "../../utils/web3.js";
import { ClientBaseURL } from "../../utils/confix";

const Dashboard = () => {
  window.Buffer = Buffer;

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [registration_Free, setRegistrationFee] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [referrerID, setReferrerID] = useState({ id: "0", amount: "" });
  const [topupVal, setTopupVal] = useState({ amount: "" });
  //88194
  // set it latter
  const [tokenPrice, setTokenPrice] = useState();
  const [copySuccess, setCopySuccess] = useState(false);

  const [userAc, setUserAc] = useState(0);

  //////////////////////////////////
  // user Detail
  const [users_id, setUsersId] = useState();
  const [users_income, setUsersIncome] = useState();
  const [users_isExist, setUsersIsExist] = useState();
  const [users_referredUsers, setUsersreffered] = useState();
  const [users_referrerID, setUsersReffereId] = useState();
  const [users_stakedToken, setUsersStakedToken] = useState();
  const [transferableToken, setTransferableToken] = useState();

  const [users_batchPaid, setUsesBatchpaid] = useState();

  //////////////////////////////////
  let location = window.location.search;

  const abcref = new URLSearchParams(location).get("abcref");
  const refid = new URLSearchParams(location).get("refid");
  function roundToFour(num) {
    return +(Math.round(num + "e+4") + "e-4");
  }
  useEffect(() => {
    if (abcref === "123xyz") {
      if (refid !== 0) {
        setReferrerID({ ...referrerID, id: refid });
      }
    }
  }, []);

  //////////////////////////////////
  // User Detail
  useEffect(() => {
    userDetail();
    async function userDetail() {
      const accounts = await web3.eth.requestAccounts();
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let userDetail = await ICU_.methods.users(accounts[0]).call();

      let {
        batchPaid,
        id,
        isExist,
        referredUsers,
        referrerID,
        income,
        stakedToken,
      } = userDetail;
      function convertToEth(data) {
        return web3.utils.fromWei(data, "ether");
      }
      const income_ = web3.utils.fromWei(income, "ether");

      stakedToken = convertToEth(stakedToken);
      stakedToken = roundToFour(stakedToken);

      setUsesBatchpaid(batchPaid);
      setUsersId(id);
      setUsersIncome(roundToFour(income_));
      setUsersIsExist(isExist);
      setUsersreffered(referredUsers);
      setUsersReffereId(referrerID);
      setUsersStakedToken(stakedToken);

      setTimeout(() => {
        let transferableToken_ = parseInt(tokenBalance) - parseInt(stakedToken);
        setTransferableToken(transferableToken_);
      }, 4000);
    }
  }, []);

  useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      if (!accounts) {
        alert("please install metamask");
      }
      let balance = await web3.eth.getBalance(accounts[0]);
      const etherValue = web3.utils.fromWei(balance, "ether");
      setBalance(roundToFour(etherValue));
      setAccount(accounts[0]);
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let RegistrationFee = await ICU_.methods
        .withdrawableROI(accounts[0])
        .call();
      // let token_rewared = await ICU_.methods.tokenReward().call();
      let tokenPriceIs = await ICU_.methods.tokenPrice().call();
      console.log("the token price is*** ", tokenPriceIs);
      const convert_regfee = web3.utils.fromWei(RegistrationFee, "ether");
      setRegistrationFee(convert_regfee);

      // token balance
      let token_balance = await BEP20_.methods.balanceOf(accounts[0]).call();

      const convert_tokenBal = web3.utils.fromWei(token_balance, "ether");
      setTokenBalance(roundToFour(convert_tokenBal));

      // Set Token PRice and Next Level Reward
      const tokenPriceIs_convert = web3.utils.fromWei(tokenPriceIs, "ether");

      setTokenPrice(roundToFour(tokenPriceIs_convert));
    }

    load();
  }, []);

  // handle change for registration
  const handleChange = (event) => {
    let { name, value } = event.target;
    setReferrerID({ ...referrerID, [name]: value });
  };

  // handle handle change topup
  const handleChangeTopUp = (event) => {
    let { name, value } = event.target;
    setTopupVal({ ...referrerID, [name]: value });
  };

  // registration
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("the referrerID", referrerID);
    let { id, amount } = referrerID;

    amount = web3.utils.toWei(amount, "ether");
    if (id === "0") {
      id = "88194";
    }
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    // let value_ = await ICU_.methods.REGESTRATION_FESS().call();
    let currentTokenAccepting = await ICU_.methods
      .currentTokenAccepting()
      .call();
    console.log("the approve currentTokenAccepting", currentTokenAccepting);
    // the approve currentTokenAccepting ERC20-Token-Accepting

    if (currentTokenAccepting === "Native-Coin-Accepting") {
      let USDT_ = new web3.eth.Contract(USDT.ABI, USDT.address);
      let isAllowance = await USDT_.methods
        .allowance(account, ICU.address)
        .call();
      let isApprove, reg_user;
      if (isAllowance < amount) {
        isApprove = await USDT_.methods
          .approve(ICU.address, amount)
          .send({ from: account });
      } else {
      }
      reg_user = await ICU_.methods
        .Registration(id, amount)
        .send({ from: account, value: 0 });
      console.log("****** native coin accepting condtion", reg_user);
      if (reg_user.status) {
        alert("Registerd Success");
      } else {
        alert("Registerd Failed !!!!");
      }
    } else {
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let approve = await BEP20_.methods
        .approve(ICU.address, amount)
        .send({ from: account });
      console.log("the approve response", approve);
      console.log("the value out of status", amount);
      if (approve.status === true) {
        let reg_user = await ICU_.methods
          .Registration(id, amount)
          .send({ from: account, value: 0 });
        if (reg_user.status) {
          alert("Registerd Success");
        } else {
          alert("Registerd Failed !!!!");
        }
      }
    }
  };

  // Top Up
  const handleSubmitTopUP = async (event) => {
    event.preventDefault();

    let { amount } = topupVal;
    // amount = amount * 1000000000000000000;
    // amount = amount * 1000000000000000000;
    amount = web3.utils.toWei(amount, "ether");

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    // let value_ = await ICU_.methods.REGESTRATION_FESS().call();
    let currentTokenAccepting = await ICU_.methods
      .currentTokenAccepting()
      .call();
    console.log("the approve currentTokenAccepting", currentTokenAccepting);
    // the approve currentTokenAccepting ERC20-Token-Accepting

    if (currentTokenAccepting === "Native-Coin-Accepting") {
      let USDT_ = new web3.eth.Contract(USDT.ABI, USDT.address);
      let isAllowance = await USDT_.methods
        .allowance(account, ICU.address)
        .call();
      let isApprove, reg_user;
      if (isAllowance < amount) {
        isApprove = await USDT_.methods
          .approve(ICU.address, amount)
          .send({ from: account });
      } else {
      }
      reg_user = await ICU_.methods
        .topUp(amount)
        .send({ from: account, value: 0 });
      console.log("****** native coin accepting condtion", reg_user);
      if (reg_user.status) {
        alert("Top UP Success");
      } else {
        alert("Top UP Failed !!!!");
      }
    } else {
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let approve = await BEP20_.methods
        .approve(ICU.address, amount)
        .send({ from: account });
      console.log("the approve response", approve);
      console.log("the value out of status", amount);
      if (approve.status === true) {
        let reg_user = await ICU_.methods
          .topUp(amount)
          .send({ from: account, value: 0 });
        if (reg_user.status) {
          alert("Top UP Success");
        } else {
          alert("Top UP Failed !!!!");
        }
      }
    }
  };

  useEffect(() => {
    let apiKey = "PSWKIR1RA7JBHWJYRBEWAHVF4KEV933CQF";
    let contractAddress = "0xeC517D7327E2cE8e0CD9f9F10F59E95A497e2868";

    fetch(
      `https://api-testnet.bscscan.com/api?module=logs&action=getLogs&address=${contractAddress}&apikey=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        let { result } = data;
        for (let i = 0; i < result.length; i++) {
          let { transactionHash } = result[i];
          web3.eth.getTransaction(transactionHash, function (err, tx) {
            abiDecoder.addABI(ICU.ABI);
            let tx_data = tx.input;
            let decoded_data = abiDecoder.decodeMethod(tx_data);

            let params = decoded_data.params;

            for (let i = 0; i < params.length; i++) {
              // console.log("in param loop", params[i]);
            }
          });
        }
      })
      // }
      .catch((err) => console.log("err", err));
  }, []);

  // your function to copy here
  const copyToClipBoard = async () => {
    try {
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let userDetail = await ICU_.methods.users(userAc).call();
      let { id } = userDetail;
      if (parseInt(id) === 0) {
        alert("Refrel Id not found");
        return;
      }
      let refLink = `${ClientBaseURL}?refid=${id}&abcref=123xyz`;
      await navigator.clipboard.writeText(refLink);
      setCopySuccess(true);
    } catch (err) {
      setCopySuccess(false);
    }
  };

  async function userAccount() {
    const accounts = await web3.eth.requestAccounts();
    if (!accounts) {
      alert("please install metamask");
    }
    setUserAc(accounts[0]);
  }

  useEffect(() => {
    userAccount();
  }, []);

  const WithDrawROI = () => {
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    async function withdrwaRoi() {
      let withdrwaroi = await ICU_.methods.withdrawROI().send({ from: userAc });

      console.log("withdrwaroi", withdrwaroi);
    }
    withdrwaRoi();
  };

  return (
    <div className="home-container">
      <div className="row">
        {/* token balance  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>DIS Balance</h5>
              <h4 className="mb-0">{tokenBalance ? tokenBalance : 0} (DIS)</h4>
            </div>
          </div>
        </div>

        {/* metamask balance  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>BNB Balance</h5>

              <h4 className="mb-0">{balance ? balance : 0}</h4>
            </div>
          </div>
        </div>
        {/* reg fee  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Withdrawable ROI</h5>
              <h4 className="mb-0">
                {registration_Free ? registration_Free : 0} (DIS)
              </h4>
            </div>
          </div>
        </div>

        {/* token price  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>DIS Price</h5>
              <h4 className="mb-0">{tokenPrice ? tokenPrice : 0} (USDT)</h4>
            </div>
          </div>
        </div>

        {/* is exist  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User Exist</h5>
              <h4 className="mb-0">{users_isExist ? "Yes" : "No"}</h4>
            </div>
          </div>
        </div>

        {/* id  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User ID</h5>
              <h4 className="mb-0">{users_id ? users_id : 0}</h4>
            </div>
          </div>
        </div>
        {/* reffer id  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Sponsor</h5>
              <h4 className="mb-0">
                {users_referrerID ? users_referrerID : 0}
              </h4>
            </div>
          </div>
        </div>

        {/* reffered user  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Direct</h5>
              <h4 className="mb-0">
                {users_referredUsers ? users_referredUsers : 0}
              </h4>
            </div>
          </div>
        </div>

        {/* income  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Income</h5>
              <h4 className="mb-0">{users_income ? users_income : 0}</h4>
            </div>
          </div>
        </div>

        {/* stack token  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Staked DIS</h5>
              <h4 className="mb-0">
                {users_stakedToken ? users_stakedToken : 0}
              </h4>
            </div>
          </div>
        </div>

        {/* transferable token  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Transferable Token</h5>
              <h4 className="mb-0">
                {(function () {
                  let transferabletoken = tokenBalance - users_stakedToken;
                  return transferabletoken;
                })()}
              </h4>
            </div>
          </div>
        </div>

        {/* withdrawable roi button  */}
        <div className="col-lg-4 col-md-4 col-sm-12 grid-margin">
          <div className="card h80">
            <div className="card-body">
              <button onClick={WithDrawROI} className="withdrwaroi">
                withdrawROI
              </button>
            </div>
          </div>
        </div>
        {/* copy link  */}
        <div className="col-12 text-center">
          <button className={`ref-btn`} onClick={copyToClipBoard}>
            Click here to copy your Refral link
          </button>
          {copySuccess === true ? (
            <span className="ref-btn-success">✓ copied.</span>
          ) : (
            ""
          )}
        </div>

        <div className="col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body text-center">DIS address 0xf250a59723cfb438645772203BA262E52DE5Cd13</div>
          </div>
        </div>
        {/* Registration function  */}
        <div className="col-sm-12 col-md-6 col-lg-6 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Registration</h5>
              <div className="row">
                <div className="col-sm-12 my-auto">
                  <form className="forms-sample" onSubmit={handleSubmit}>
                    <div className="form-group w-100">
                      <input
                        className="form-control mt-2"
                        type="number"
                        required
                        name="id"
                        onChange={handleChange}
                        value={referrerID.id}
                        placeholder="Referral ID"
                      />
                      <input
                        className="form-control mt-2 pt-2"
                        type="number"
                        required
                        name="amount"
                        onChange={handleChange}
                        value={referrerID.amount}
                        placeholder="amount"
                      />
                      <input
                        className="btn mt-3 submitbtn_"
                        type="submit"
                        value="Submit"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TopUP function  */}
        <div className="col-sm-12 col-md-6 col-lg-6 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Top Up</h5>
              <div className="row">
                <div className="col-sm-12 my-auto">
                  <form className="forms-sample" onSubmit={handleSubmitTopUP}>
                    <div className="form-group w-100">
                      <input
                        className="form-control mt-2 pt-2"
                        type="number"
                        required
                        name="amount"
                        onChange={handleChangeTopUp}
                        value={topupVal.amount}
                        placeholder="amount"
                      />
                      <input
                        className="btn mt-3 submitbtn_"
                        type="submit"
                        value="Submit"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
