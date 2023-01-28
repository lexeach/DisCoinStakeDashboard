import React, { useEffect, useState } from "react";
import abiDecoder from "abi-decoder";
import { Buffer } from "buffer";

import { useLocation } from "react-router-dom";
import Web3 from "web3";
import { ICU, BEP20, USDT } from "../../utils/web3.js";

import { baseUrl, ClientBaseURL } from "../../utils/confix";

const Dashboard = () => {
  // const web3 = new Web3("https://data-seed-prebsc-2-s1.binance.org:8545");
  window.Buffer = Buffer;

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [frznBalance, setFrznBalance] = useState();
  const [registration_Free, setRegistrationFee] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [current_id, setCurrentId] = useState();
  const [current_tokenAccepting, setCurrentTokenAccepting] = useState();
  const [tokenRewarded, setTokenRewarded] = useState();
  const [payAutoPool, setPayAutoPool] = useState();
  const [levelPrice, setLevelPrice] = useState();

  const [referrerID, setReferrerID] = useState({ id: "", amount: "" });
  const [tokenReword, setTokenReword] = useState({ amount: "" });
  const [regFess, setRegFess] = useState({ amount: "" });
  const [tkAcc, settkAcc] = useState(null);

  // set it latter
  const [tokenPrice, setTokenPrice] = useState();
  const [nextReward, setNetxtReward] = useState();
  const [copySuccess, setCopySuccess] = useState(false);

  const [userAc, setUserAc] = useState(0);

  //////////////////////////////////
  // user Detail
  const [users_id, setUsersId] = useState();
  const [users_income, setUsersIncome] = useState();
  const [users_isExist, setUsersIsExist] = useState();
  const [users_levelIncomeReceived, setUsersLevelIncomeReceived] = useState();
  const [users_referredUsers, setUsersreffered] = useState();
  const [users_referrerID, setUsersReffereId] = useState();
  const [users_stakeTime, setUsersStakeTime] = useState();
  const [users_stakedToken, setUsersStakedToken] = useState();
  const [users_withdrawable, setUsersWithDrawable] = useState();

  const [users_batchPaid, setUsesBatchpaid] = useState();

  //////////////////////////////////
  const location = useLocation().search;

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
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      // userAc
      // 0xb8d4217b314192857a2ba34f413008f4eadfd0f0
      let userDetail = await ICU_.methods.users(userAc).call();
      let {
        batchPaid,
        id,
        isExist,
        levelIncomeReceived,
        referredUsers,
        referrerID,
        income,
        stakeTimes,
        stakedToken,
        withdrawable,
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
      setUsersLevelIncomeReceived(levelIncomeReceived);
      setUsersreffered(referredUsers);
      setUsersReffereId(referrerID);
      setUsersStakeTime(stakeTimes);
      setUsersStakedToken(stakedToken);
      setUsersWithDrawable(withdrawable);
    }
  }, []);

  useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      if (!accounts) {
        alert("please install metamask");
      }
      // console.log("the user detailssss");
      let balance = await web3.eth.getBalance(accounts[0]);
      const etherValue = web3.utils.fromWei(balance, "ether");
      setBalance(roundToFour(etherValue));
      setAccount(accounts[0]);
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let frozenBalance = await BEP20_.methods
        ._frozenBalance(accounts[0])
        .call();
      let RegistrationFee = await ICU_.methods.withdrawableROI().call();
      let currentId = await ICU_.methods.currUserID().call();
      let currentTokenAccepting = await ICU_.methods
        .currentTokenAccepting()
        .call();
      let token_rewared = await ICU_.methods.tokenReward().call();
      let pay_auto_pool = await ICU_.methods.Autopool_Level_Income().call();
      let level_income = await ICU_.methods.level_income().call();
      let tokenPriceIs = await ICU_.methods.tokenPrice().call();
      let getNextReward = await ICU_.methods.getNextReward().call();

      // console.log("user userDetail_", userDetail_);
      // console.log("level income", level_income, getNextReward, tokenPriceIs);

      // const etherValue = Web3.utils.fromWei('1000000000000000000', 'ether');

      const convert_pay_auto_pool = web3.utils.fromWei(pay_auto_pool, "ether");

      const frozenBalance_convert = web3.utils.fromWei(frozenBalance, "ether");
      setFrznBalance(roundToFour(frozenBalance_convert));

      const convert_regfee = web3.utils.fromWei(RegistrationFee, "ether");
      setRegistrationFee(convert_regfee);

      setCurrentId(currentId);
      setCurrentTokenAccepting(currentTokenAccepting);

      const token_rewared_convert = web3.utils.fromWei(token_rewared, "ether");
      setTokenRewarded(roundToFour(token_rewared_convert));
      setPayAutoPool(roundToFour(convert_pay_auto_pool));

      const convert_levelincome = web3.utils.fromWei(level_income, "ether");
      setLevelPrice(roundToFour(convert_levelincome));

      // token balance
      let token_balance = await BEP20_.methods.balanceOf(accounts[0]).call();

      const convert_tokenBal = web3.utils.fromWei(token_balance, "ether");
      setTokenBalance(roundToFour(convert_tokenBal));

      // Set Token PRice and Next Level Reward
      const tokenPriceIs_convert = web3.utils.fromWei(tokenPriceIs, "ether");
      const getNextReward_convert = web3.utils.fromWei(getNextReward, "ether");

      setTokenPrice(roundToFour(tokenPriceIs_convert));
      setNetxtReward(roundToFour(getNextReward_convert));
    }

    load();
  }, []);

  const handleChange = (event) => {
    let { name, value } = event.target;
    // console.log("name", name, "value", value, "referrerId", referrerID);
    setReferrerID({ ...referrerID, [name]: value });
  };

  const handleChangeTkReword = (event) => {
    let { name, value } = event.target;
    setTokenReword({ ...tokenReword, [name]: value });
  };

  const handleChangeRegFess = (event) => {
    let { name, value } = event.target;
    setRegFess({ ...regFess, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("the referrerID", referrerID);

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    // let value_ = await ICU_.methods.REGESTRATION_FESS().call();
    // let currentTokenAccepting = await ICU_.methods
    //   .currentTokenAccepting()
    //   .call();
    // console.log("the approve currentTokenAccepting", currentTokenAccepting);
    // the approve currentTokenAccepting ERC20-Token-Accepting
    let { id, amount } = referrerID;
    console.log("the amount and the id", id, amount);
    // return;
    // if (currentTokenAccepting === "Native-Coin-Accepting") {
    // let USDT_ = new web3.eth.Contract(USDT.ABI, USDT.address);
    // let isAllowance = await USDT_.methods
    //   .allowance(account, ICU.address)
    //   .call();
    // let isApprove, reg_user;
    // if (isAllowance < value_) {
    //   isApprove = await USDT_.methods
    //     .approve(ICU.address, value_)
    //     .send({ from: account });
    // } else {
    // }

    let reg_user = await ICU_.methods
      .Registration(id, amount)
      .send({ from: account, value: 0 });
    console.log("****** Registration success", reg_user);
    if (reg_user.status) {
      alert("Registerd Success");
    } else {
      alert("Registerd Failed !!!!");
    }
    // } else {
    //   let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
    //   let approve = await BEP20_.methods
    //     .approve(ICU.address, amount)
    //     .send({ from: account });
    //   console.log("the approve response", approve);
    //   console.log("the value out of status", amount);
    //   if (approve.status === true) {
    //     let reg_user = await ICU_.methods
    //       .regUser(id, amount)
    //       .send({ from: account, value: 0 });
    //     if (reg_user.status) {
    //       alert("Registerd Success");
    //     } else {
    //       alert("Registerd Failed !!!!");
    //     }
    //   }
    // }
  };

  const handleSubmitTKRword = async (event) => {
    event.preventDefault();

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let tkrword = await ICU_.methods
      .changeTokenReward(tokenReword.amount)
      .send({ from: account });
    if (tkrword.status) {
      alert("Reworded");
    } else {
      alert("Failed");
    }
  };

  const handleSubmitRegFee = async (event) => {
    event.preventDefault();

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let regfess = await ICU_.methods
      .setRegistrationFess(regFess.amount)
      .send({ from: account });
    if (regfess.status) {
      alert("Reworded");
    } else {
      alert("Failed");
    }
  };

  const handleSubmitAcceptance = async (event) => {
    event.preventDefault();
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let tkAccept = await ICU_.methods
      .setTokenAcceptance(tkAcc.value)
      .send({ from: account });
    if (tkAccept.status) {
      alert("Token Acceptance");
    } else {
      alert("Failed");
    }
  };

  const tokenAcceptanceOption = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
  ];

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
      console.log("in copy to clip");
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      console.log("after icu contract");
      console.log("userAc", userAc);
      let userDetail = await ICU_.methods.users(userAc).call();
      console.log("the user detail", userDetail);
      let { id } = userDetail;
      // console.log("id", id);
      if (parseInt(id) === 0) {
        alert("Refrel Id not found");
        return;
      }
      let refLink = `${ClientBaseURL}?refid=${id}&abcref=123xyz`;
      console.log("reflink", refLink);
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

  return (
    <div className="home-container">
      <div className="row">
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Frozen Balance </h5>
              <h4 className="mb-0">{frznBalance ? frznBalance : 0} (TRCT)</h4>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Token Balance</h5>
              <h4 className="mb-0">{tokenBalance ? tokenBalance : 0} (TRCT)</h4>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Metamask Balance</h5>

              <h4 className="mb-0">{balance ? balance : 0}</h4>
            </div>
          </div>
        </div>
        {/* reg fee  */}
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Withdrwa able ROI</h5>
              <h4 className="mb-0">
                {registration_Free ? registration_Free : 0} (USDT)
              </h4>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Current ID</h5>
              <h4 className="mb-0">{current_id ? current_id : 0}</h4>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Sponser Income</h5>
              <h4 className="mb-0" style={{ fontSize: "15px" }}>
                {current_tokenAccepting ? registration_Free / 5 : 0} (USDT)
              </h4>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Token reward</h5>
              <h4 className="mb-0">
                {tokenRewarded ? tokenRewarded : 0} (TRCT)
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Token Price</h5>
              <h4 className="mb-0">{tokenPrice ? tokenPrice : 0} (USDT)</h4>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Next Reward</h5>
              <h4 className="mb-0">{nextReward ? nextReward : 0} (TRCT)</h4>
            </div>
          </div>
        </div>

        <div className="col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body text-center">User</div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Pay autopool</h5>
              <h2 className="mb-0">{payAutoPool ? payAutoPool : 0} (USDT)</h2>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Level Income</h5>
              <h2 className="mb-0">{levelPrice ? levelPrice : 0} (USDT)</h2>
            </div>
          </div>
        </div>

        <div className="col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Referrel ID</h5>
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

        <div className="col-sm-12 grid-margin">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h5>is Exist</h5>
                  <h4 className="mb-0">{users_isExist ? users_isExist : 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h5>ID</h5>
                  <h4 className="mb-0">{users_id ? users_id : 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h5>Refferrer ID</h5>
                  <h4 className="mb-0">
                    {users_referrerID ? users_referrerID : 0}
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h5>Reffered User</h5>
                  <h4 className="mb-0">
                    {users_referredUsers ? users_referredUsers : 0}
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h5>Income</h5>
                  <h4 className="mb-0">{users_income ? users_income : 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h5>Level Income Recived</h5>
                  <h4 className="mb-0">
                    {users_levelIncomeReceived ? users_levelIncomeReceived : 0}
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h5>StakedToken</h5>
                  <h4 className="mb-0">
                    {users_stakedToken ? users_stakedToken : 0}
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h5>StakeTimes</h5>
                  <h4 className="mb-0">
                    {users_stakeTime ? users_stakeTime : 0}
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h5>Withdrawable</h5>
                  <h4 className="mb-0">
                    {users_withdrawable ? users_withdrawable : 0}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default Dashboard;
