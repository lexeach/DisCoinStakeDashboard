import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Web3 from "web3";
import { ICU } from "../../utils/web3.js";
import { baseUrl, ClientBaseURL } from "../../utils/confix";
import Event from "./event";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted pink",
    color: state.isSelected ? "red" : "blue",
    padding: 20,
  }),
  control: () => ({
    width: 200,
    position: "relative",
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";
    const color = "white";
    return { ...provided, opacity, transition, color };
  },
};

const EventsList = () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const [eventData, setEventData] = useState();
  const [totalCount, setTotalCount] = useState();
  const [levelPrice, setLevelPrice] = useState();
  const [userList, setUserList] = useState();
  const [users_, setUsers] = useState([]);

  const [users_autoPoolPayReceived, setUsersAutoPoolPayReceived] = useState();
  const [users_autopoolPayReciever, setUsersAutopoolPayReciever] = useState();
  const [users_batchPaid, setUsesBatchpaid] = useState();
  const [users_id, setUsersId] = useState();
  const [users_income, setUsersIncome] = useState();
  const [users_isExist, setUsersIsExist] = useState();
  const [users_levelIncomeReceived, setUsersLevelIncomeReceived] = useState();
  const [users_missedPoolPayment, setUsersMIssedPoolPayment] = useState();
  const [users_referredUsers, setUsersreffered] = useState();
  const [users_referrerID, setUsersReffereId] = useState();
  const [search, setSearch] = useState({ data: "", height: "" });
  const [type, setType] = useState();
  const [height, setHeight] = useState();

  const [readData, setReadData] = useState({
    user_list: "",
    users: "",
    level_price: "",
  });

  // useEffect(() => {
  //   console.log("in events......... **** ");
  //   getAllEvents();
  // }, []);

  // async function getAllEvents() {
  //   let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
  //   const contents = await web3.eth.getStorageAt(ICU.address, 0);
  //   const contents1 = await web3.eth.getStorageAt(ICU.address, 1);
  //   const contents2 = await web3.eth.getStorageAt(ICU.address, 2);

  //   console.log("the contentssss ", contents, contents2, contents1);
  // }

  useEffect(() => {
    let data = null;
    eventList(data).then((res) => {
      let { event, totalCount } = res.data.body;
      setTotalCount(totalCount);
      setEventData(event);
    });
  }, []);

  async function eventList(data) {
    try {
      // console.log("the api call data", data);
      // console.log("the URL ..", `${baseUrl}/api/event?${data}`);
      if (data) {
        let response = await axios.get(`${baseUrl}/api/event?${data}`);

        // console.log("***** the respone", response);
        return response;
      } else {
        let response = await axios.get(`${baseUrl}/api/event?`);
        return response;
      }
    } catch (error) {
      console.log("the error in event list called", error);
    }
  }

  const handleChange = (event) => {
    let { name, value } = event.target;
    setSearch({ ...search, [name]: value });
  };

  const handleChangeRead = (event) => {
    let { name, value } = event.target;
    setReadData({ ...readData, [name]: value });
  };

  const handleSubmit1 = async (event) => {
    event.preventDefault();

    if (type === undefined) {
      setType({ value: "name" });
      let data = `name=${search.data}`;
      // console.log("form data", data);
      eventList(data).then((res) => {
        let { event, totalCount } = res.data.body;
        setTotalCount(totalCount);
        setEventData(event);
      });
    } else {
      let data = `${type.value}=${search.data}`;
      // console.log("form data", data);
      eventList(data).then((res) => {
        let { event, totalCount } = res.data.body;
        setTotalCount(totalCount);
        setEventData(event);
      });
    }
  };

  const nameOptionChange = (event) => {
    let data = `name=${event.value}`;
    eventList(data).then((res) => {
      let { event, totalCount } = res.data.body;
      setTotalCount(totalCount);
      setEventData(event);
    });
  };

  const handleSubmitUserList = async (event) => {
    event.preventDefault();
    let user_list_data = readData.user_list;
    user_list_data = parseInt(user_list_data);
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let userlist = await ICU_.methods.userList(user_list_data).call();
    setUserList(userlist);
  };

  const handleSubmitLevelPrice = async (event) => {
    event.preventDefault();

    let level_price_data = readData.level_price;
    level_price_data = parseInt(level_price_data);
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let level_income = await ICU_.methods.LEVEL_PRICE(level_price_data).call();
    const convert_income = web3.utils.fromWei(level_income, "ether");
    setLevelPrice(convert_income);
  };

  function roundToFour(num) {
    return +(Math.round(num + "e+4") + "e-4");
  }

  const handleSubmitUser = async (event) => {
    event.preventDefault();

    let users_ = readData.users;
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let userDetail = await ICU_.methods.users(users_).call();

    const income_ = web3.utils.fromWei(userDetail.income, "ether");

    setUsersAutoPoolPayReceived(userDetail.autoPoolPayReceived);
    setUsersAutopoolPayReciever(userDetail.autopoolPayReciever);
    setUsesBatchpaid(userDetail.batchPaid);
    setUsersId(userDetail.id);
    setUsersIncome(roundToFour(income_));
    setUsersIsExist(userDetail.isExist);
    setUsersLevelIncomeReceived(userDetail.levelIncomeReceived);
    setUsersMIssedPoolPayment(userDetail.missedPoolPayment);
    setUsersreffered(userDetail.referredUsers);
    setUsersReffereId(userDetail.referrerID);
  };

  const nameTypeOptions = [
    { value: "name", label: "Name" },
    { value: "sender", label: "Sender" },
    { value: "_referrer", label: "Referrer" },
    { value: "_referral", label: "Referral" },
    { value: "tokenType", label: "TokenType" },
    { value: "height", label: "Height" },
  ];

  const nameOptions = [
    { value: "autoPoolEvent", label: "Auto Pool" },
    { value: "successfulPay", label: "Successfull Pay" },
    { value: "getMoneyForLevelEvent", label: "Money Level" },
    { value: "regLevelEvent", label: "Reg Level" },
  ];

  useEffect(() => {
    getEvents_();
  }, []);
  async function getEvents_() {
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    // let events = await ICU_.getPastEvents("MyEvent");
    // console.log("events___ ***", events);
  }

  return (
    <div className="custom-eventlist">
      <div className="row">
        <div className="col-lg-6 col-md-12 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User List </h5>
              <div className="row">
                <div className="col-12 col-sm-12 col-xl-12 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <form
                      className="forms-sample w-100"
                      onSubmit={handleSubmitUserList}
                    >
                      <div className="form-group w-100 d-flex justify-content-between">
                        <input
                          className="form-control mt-2"
                          type="number"
                          required
                          name="user_list"
                          onChange={handleChangeRead}
                          value={readData.user_list}
                        />
                        <input
                          className="btn btn-primary mt-2"
                          type="submit"
                          value="Submit"
                        />
                      </div>
                    </form>
                  </div>
                  <h4 style={{ fontSize: "15px" }} className="mb-0">
                    {userList ? userList : 0}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Level Price</h5>
              <div className="row">
                <div className="col-12 col-sm-12 col-xl-12 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <form
                      className="forms-sample w-100"
                      onSubmit={handleSubmitLevelPrice}
                    >
                      <div className="form-group w-100   d-flex justify-content-between">
                        <input
                          className="form-control mt-2"
                          type="number"
                          required
                          name="level_price"
                          onChange={handleChangeRead}
                          value={readData.level_price}
                        />
                        <input
                          className="btn btn-primary mt-2"
                          type="submit"
                          value="Submit"
                        />
                      </div>
                    </form>
                  </div>
                  <h4 className="mb-0">{levelPrice ? levelPrice : 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Users</h5>
              <div className="row">
                <div className="col-12 col-sm-12 col-xl-12 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <form
                      className="forms-sample w-100"
                      onSubmit={handleSubmitUser}
                    >
                      <div className="form-group w-100   d-flex justify-content-between">
                        <input
                          className="form-control mt-2"
                          type="text"
                          required
                          name="users"
                          onChange={handleChangeRead}
                          value={readData.users}
                        />
                        <input
                          className="btn btn-primary mt-2"
                          type="submit"
                          value="Submit"
                        />
                      </div>
                    </form>
                  </div>

                  {users_autoPoolPayReceived ? (
                    <div className="user-detail-res">
                      <div className="d-flex">
                        <h4 className="heading_"> Auto Pool Pay Recived :- </h4>
                        <h4> {users_autoPoolPayReceived}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> Auto Pool Pay Reciver :- </h4>
                        <h4> {users_autopoolPayReciever}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> Batch Paid :- </h4>
                        <h4> {users_batchPaid}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> ID :- </h4>{" "}
                        <h4> {users_id}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> Income :- </h4>
                        <h4> {users_income}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> is Exist :- </h4>
                        <h4> {users_isExist}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> Level Income Recived :- </h4>
                        <h4> {users_levelIncomeReceived}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> Missed Pool Payment :- </h4>
                        <h4> {users_missedPoolPayment}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> Reffered User :- </h4>
                        <h4> {users_referredUsers}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> Refferrer ID :- </h4>
                        <h4> {users_referrerID}</h4>
                      </div>
                    </div>
                  ) : (
                    0
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4 className="card-title">Events</h4>
                <div className="d-flex">
                  <form className="forms-sample" onSubmit={handleSubmit1}>
                    <div className="form-group d-flex event-custom-select">
                      <Select
                        styles={customStyles}
                        required
                        options={nameOptions}
                        placeholder="Name"
                        className="form-control custom-select1 m-0 p-0 mr-2"
                        onChange={nameOptionChange}
                      />

                      <Select
                        styles={customStyles}
                        required
                        options={nameTypeOptions}
                        placeholder="Token Type"
                        className="form-control custom-select1 m-0 p-0 mr-2"
                        onChange={setType}
                      />

                      <input
                        className="form-control ml-1 mr-1"
                        type="text"
                        name="data"
                        placeholder="Enter Sender .... "
                        onChange={handleChange}
                        value={search.data}
                      />
                      <Select
                        styles={customStyles}
                        required
                        options={nameTypeOptions}
                        placeholder="Select Height"
                        className="form-control custom-select1 m-0 p-0 mr-2"
                        onChange={setHeight}
                      />

                      <input
                        className="form-control ml-1 mr-1"
                        type="text"
                        name="height"
                        placeholder="Enter Heigth .... "
                        onChange={handleChange}
                        value={search.height}
                      />

                      <input
                        className="btn btn-primary"
                        type="submit"
                        value="Search"
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>User / Sender </th>
                      <th>Referrer / Referral</th>
                      <th>Token Type</th>
                      <th>Height</th>
                    </tr>
                  </thead>

                  {eventData && eventData.length
                    ? eventData.map((event) => (
                        <Event
                          key={event._id}
                          id={event._id}
                          name={event.name}
                          user={event._user}
                          sender={event.sender}
                          referrer={event._referrer}
                          referral={event._referral}
                          tokenType={event.tokenType}
                          height={event.height}
                        />
                      ))
                    : "Event Data comming soon..."}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsList;
