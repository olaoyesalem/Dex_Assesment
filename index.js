import {
    ROUTER_ADDRESS,
    ROUTER_ABI,
    MT_TOKEN_ADDRESS,
    AQT_TOKEN_ADDRESS,
    ERC20_ABI,
    FACTORY_ABI,
    FACTORY_ADDRESS,
    ADD_LIQUIDITY_ADDRESS,
    ADD_LIQUIDITY_ABI,
    FULL_INTERACTION_ADDRESS,
    FULL_INTERACTION_ABI
 } from './constant.js'
 import { ethers ,BigNumber} from './ethers-5.6.esm.min.js'
 
 const connectButton = document.getElementById('connectButton')
 connectButton.onclick = connect
 
 const createLiqudityButton =document.getElementById('addLiquidityModal')
 createLiqudityButton.onclick= createLiquidity

 const swapButton =document.getElementById('swap')
 swapButton.onclick= swap
  
 let account,userAddress
 
 function listenForTxnMine(txnResponse, provider) {
     // this is to listen to the blockchain and see events that has happened
     console.log(`Mining ${txnResponse.hash} hash`)
 
     //create a listner for the blockchain
     return new Promise((resolve, reject) => {
         provider.once(txnResponse.hash, (transactionReceipt) => {
             console.log(
                 `Completed with ${transactionReceipt.confirmations} confirmations`
             )
             resolve()
         })
     })
 }
 
 async function connect() {
     if (typeof window.ethereum !== 'undefined') {
         try {
 
             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              userAddress = accounts[0];
             console.log(userAddress);
         
            //  const displayAddress = account.slice(0, 5) + '...' + account.slice(-3);
               await window.ethereum.request({
                 method: 'wallet_switchEthereumChain',
                 params: [{ chainId: "0xd431" }]
               });
               
         } catch (error) {
             console.log(error)
         }
         connectButton.innerHTML = userAddress
     
     } else {
         connectButton.innerHTML = 'Install Metamask !!!!'
     }
     
 }
 
 async function createLiquidity() {
     const amount1 = document.getElementById('tokenAmount1').value
     const amount2=document.getElementById('tokenAmount2').value
     console.log(`----------------------------------------`)
     if (typeof window.ethereum !== 'undefined') {
         const provider = new ethers.providers.Web3Provider(window.ethereum)
         const signer = provider.getSigner()
         const address = await signer.getAddress();
         console.log(address)

         

         
 
         try {
             const contract = new ethers.Contract(
                FULL_INTERACTION_ADDRESS,
                  FULL_INTERACTION_ABI,
                  signer
                 )

                 
                  // transfer
                  
                 
               

                const mtContract =  new ethers.Contract(MT_TOKEN_ADDRESS,ERC20_ABI,signer)
                await mtContract.approve(FULL_INTERACTION_ADDRESS,"100000000000000000000");
             

                 const aqtContract = new ethers.Contract(AQT_TOKEN_ADDRESS,ERC20_ABI,signer)
                 await aqtContract.approve(FULL_INTERACTION_ADDRESS,"100000000000000000000");
                   
                 await aqtContract.transfer(FULL_INTERACTION_ADDRESS,ethers.utils.parseEther(amount1))
                 await mtContract.transfer(FULL_INTERACTION_ADDRESS,ethers.utils.parseEther(amount2))

                
                 const txnResponse = await contract.addLiquidity(AQT_TOKEN_ADDRESS,MT_TOKEN_ADDRESS,ethers.utils.parseEther(amount1),ethers.utils.parseEther(amount2)) // chasnge AQT and MT
                
                 console.log(`-------------------------------------`)
                 console.log(`Done........`)
                 alert(`Liquidity  of ${MT_TOKEN_ADDRESS}  and ${AQT_TOKEN_ADDRESS} Added`)
                 listenForTxnMine(txnResponse,provider)

                 const txnResponse2 = await contract.performSwap(MT_TOKEN_ADDRESS,AQT_TOKEN_ADDRESS,"10000000","1000000","0xf3682d3399e150df13645cfbddf707e8d50400fe")
                   


                
             }             
            
         catch (error) {
             console.error(error)
         }
     }
     
 }
 
 
 async function swap(){
   //  const amountOfLiquidity=document.getElementById('amountOfLiquidity').value
     console.log(`----------------------------------------`)
     if (typeof window.ethereum !== 'undefined') {
         const provider = new ethers.providers.Web3Provider(window.ethereum)
         const signer = provider.getSigner()
 
         console.log("1")
        try {
            
            const contract = new ethers.Contract(
                FULL_INTERACTION_ADDRESS,
                  FULL_INTERACTION_ABI,
                  signer
                 )
                console.log("2")
                // const mtContract =  new ethers.Contract(MT_TOKEN_ADDRESS,ERC20_ABI,signer)
                //  await mtContract.approve(ROUTER_ADDRESS,"100000000000000000000");

                 const aqtContract = new ethers.Contract(AQT_TOKEN_ADDRESS,ERC20_ABI,signer)
                 await aqtContract.approve(ROUTER_ADDRESS,"100000000000000000000");
                
                await aqtContract.transfer(FULL_INTERACTION_ADDRESS,ethers.utils.parseEther("1")) 
                 const txnResponse = await contract.performSwap(ADD_LIQUIDITY_ADDRESS,MT_TOKEN_ADDRESS,"10000000","1000000","0xf3682d3399e150df13645cfbddf707e8d50400fe")
                
                 console.log(`-------------------------------------`)
                 console.log(`Done........`)
                 
                 listenForTxnMine(txnResponse,provider)
                        
                         


        } catch (error) {
            console.log(error)
        }
     }
 
 }


 async function getPair (){

    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

       try {
           
           const contract = new ethers.Contract(
               FACTORY_ADDRESS,
                 FACTORY_ABI,
                 signer
                )
              
                
               // const txnResponse = await contract.createPair(AQT_TOKEN_ADDRESS,MT_TOKEN_ADDRESS);
                const check = await contract.allPairs(0);
                console.log(check)
                //console.log(txnResponse)
               
                console.log(`-------------------------------------`)
                console.log(`Done........`)
                
               // listenForTxnMine(txnResponse,provider)
                       
                        


       } catch (error) {
           console.log(error)
       }
    }

 }


 // lett them follownthe txn on tornet using sigmate