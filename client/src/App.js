import { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState("");

  useEffect(() => {
    getTransactions()
      .then((data) => {
        setTransactions(data);
        console.log("Received transactions:", data);
      })
      .catch((error) => console.error("Error fetching transactions:", error));

    const intervalId = setInterval(updateTransactions, 10000);
    return () => clearInterval(intervalId);
  }, []);

  async function getTransactions() {
    const url = `${process.env.REACT_APP_API_URL}/transaction`;

    const response = await fetch(url);
    return await response.json();
  }

  async function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = name.split(" ")[0];

    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);

        // After adding a new transaction, fetch and update the transactions
        updateTransactions();
      });
  }

  async function updateTransactions() {
    try {
      const data = await getTransactions();
      setTransactions(data);
      console.log("Received updated transactions:", data);
    } catch (error) {
      console.error("Error fetching updated transactions:", error);
    }
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);

  return (
    <div className="min-h-screen bg-[#f1f6d7ff] text-[#86a084ff] box-border" style={{ fontFamily: 'Trebuchet MS, sans-serif' }}>
      <header className="pt-4">
        <div className="top-img flex justify-center items-center">
          <div className="w-[70vw] h-[2vh] 2xl:w-[50vw] 2xl:h-[1.5vh] overflow-hidden relative">
            <img
              className="w-full h-full object-cover object-center rounded-2xl"
              src="/images/header-img.jpg"
              alt="Header of sky"
            />
          </div>
        </div>
        <div className="btm-img flex justify-center items-center mt-3 title-img">
          <div
            style={{
              backgroundImage: 'url("/images/header-img.jpg")',
              backgroundSize: "cover",
              borderRadius: "15px",
            }}
            className="flex items-center justify-center w-[70vw] h-[8vh] 2xl:w-[50vw] 2xl:h-[4vh] rounded-lg pb-1"
          >
            <h2 className="flex items-center justify-center h-full text-[#f1f6d7ff] text-4xl font-extrabold">
              Personal Expense Tracker
            </h2>
          </div>
        </div>
      </header>

      <section className="flex justify-center items-center pt-4">
        <div className="flex justify-center 2xl:justify-between items-start w-[70vw] xl:w-[50vw]">
          <aside className="web-info flex-col">
            <div className="pb-4">
              <div
                style={{
                  backgroundImage: 'url("/images/icon-img.jpg")',
                  backgroundSize: "cover",
                  borderRadius: "15px",
                }}
                className="size-44 rounded-lg pb-3"
              ></div>
            </div>
            <div className="pb-10">
              <div className="bg-[#70894bff] opacity-70 w-[11rem] h-[20rem] rounded-[20px]">
                <div className="flex justify-center items-center h-[19rem] px-7 mt-[-4px]">
                  <p className="text-center text-[#f1f6d7ff] text-xl">
                    Use a <strong>+</strong> to add an <strong>income</strong>
                    <br /> <br />
                    Use a <strong>-</strong> to add an <strong>expense</strong>
                  </p>
                </div>
              </div>
            </div>
          </aside>
          <main className="pt-4">
            <div className="w-[50vw] 2xl:w-[35vw] mx-[40px]">
              <h1 className="font-extrabold text-8xl text-center">${balance}</h1>
              <form className="mt-10" action="" onSubmit={addNewTransaction}>
                <div className="basic flex gap-2 mb-2">
                  <input
                    type="text"
                    value={name}
                    className="w-full bg-transparent text-black border-2 border-black px-5 py-2 rounded "
                    onChange={(ev) => setName(ev.target.value)}
                    placeholder={"-50 dinner"}
                  />
                  <input
                    type="date"
                    value={datetime}
                    className="w-full bg-transparent text-[#888] border-2 border-gray-700 px-5 py-2 rounded"
                    onChange={(ev) => setDatetime(ev.target.value)}
                  />
                </div>
                <div className="description">
                  <input
                    type="text"
                    value={description}
                    className="w-full bg-transparent text-black border-2 border-gray-700 px-5 py-2 rounded"
                    onChange={(ev) => setDescription(ev.target.value)}
                    placeholder={"description"}
                  ></input>
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 border-0 rounded-md py-2 bg-[#70894bff] text-[#f1f6d7ff] font-bold text-xl"
                >
                  Add new transaction
                </button>
              </form>
              <div className="transactions mt-5 mb-24">
                {transactions.length > 0 &&
                  transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="transaction flex py-3 justify-between border-t border-solid border-gray-700 first:border-t-0"
                    >
                      <div className="left">
                        <div className="name text-2xl font-bold">
                          {transaction.name}
                        </div>
                        <div className="description text-sm mt-1 text-[#888]">
                          {transaction.description}
                        </div>
                      </div>
                      <div className="right text-right">
                        <div
                          className={`price ${
                            transaction.price < 0
                              ? "text-red-500"
                              : "text-green-500"
                          } text-2xl font-bold`}
                        >
                          {transaction.price}
                        </div>
                        <div className="datetime text-sm text-[#888]">
                          {new Date(transaction.datetime).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

export default App;
