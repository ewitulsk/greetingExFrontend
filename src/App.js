import { useEffect, useState } from "react";
import { Contract, providers } from "ethers";
import {contractAddr, contractABI} from "./contractInfo"

function App() {

  const [greeting, setGreeting] = useState();
  const [signer, setSigner] = useState();

  const provider = new providers.Web3Provider(window.ethereum, "maticmum");

  const readContract = new Contract(contractAddr, contractABI, provider);

  async function connectWallet(){
    await provider.send("eth_requestAccounts", []);
    const _signer = provider.getSigner();
    setSigner(_signer);
    console.log("Account: ", await _signer.getAddress());    
  }

  async function setGreetingInContract(string){
    if(signer){
      const writeContract = new Contract(contractAddr, contractABI, signer);
      const tx = writeContract.setGreeting(string);
      console.log(tx)
    }
    else{
      alert("Please Connect MetaMask!!!")
    }
  }

  function submitForm(e){
    e.preventDefault();
    const _greeting = e.target.greeting.value
    setGreetingInContract(_greeting);
  }

  useEffect( () => {
    async function getGreeting(){
      const greeting = await readContract.greet();
      console.log(greeting);
      await setGreeting(greeting);
    }

      const _signer = provider.getSigner();
      if(_signer._address){
        console.log("setting signer")
        setSigner(_signer);
      }
      else if(! _signer){
        alert("Please install MetaMask!")
      }
      

    getGreeting();
  }, [])

  return (
    <div onSubmit={submitForm}>
      <button onClick={connectWallet}>Connect Wallet</button>
      <br/>
      Current Greeting: {greeting}
      <form>
        <label>Enter Greeting: </label>
        <input type="text" name="greeting"/>
        <button type="submit">Submit</button>
      </form>

    </div>
  );
}

export default App;
