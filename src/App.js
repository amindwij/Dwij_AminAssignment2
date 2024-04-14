import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Form, Button, Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import PriceFeed from './artifacts/contracts/PriceFeed.sol/PriceFeed.json';

function App() {
  const [currentPrice, setCurrentPrice] = useState('');
  const [selectedPair, setSelectedPair] = useState('');
  const [selectedPairIndex, setSelectedPairIndex] = useState('');

  const cryptoContractAddress = process.env.REACT_APP_CRYPTO_CONTRACT_ADDRESS;
  
  const cryptoProvider = new ethers.providers.Web3Provider(window.ethereum);
  const cryptoPriceFeedContract = new ethers.Contract(cryptoContractAddress, PriceFeed.abi, cryptoProvider);

  const fetchPairPrice = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed.');
      }
  
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        throw new Error('No accounts found in MetaMask.');
      }
  
      const selectedAccount = accounts[0];
  
      const contractWithSigner = cryptoPriceFeedContract.connect(cryptoProvider.getSigner());
  
      const transaction = await contractWithSigner.updatePrice(selectedPairIndex, { gasLimit: 300000 }); // Specify gas limit
      await transaction.wait();
  
      const latestPrice = await cryptoPriceFeedContract.getLastFetchedPrice(selectedPairIndex);
      setCurrentPrice('$' + parseInt(latestPrice) / 100000000); 
    } catch (error) {
      console.error('Error fetching pair price:', error.message);
    }
  };

  const handlePairChange = (e) => {
    setCurrentPrice('');
    setSelectedPair(e.target.value);
    setSelectedPairIndex(e.target.id);
  };

  return (
    <div className='full-screen'>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Cryptocurrency Converter ASSIGNMENT 2</Navbar.Brand>
          <Nav className="me-auto">
          
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Row className='justify-content-center'>
          <Col xs={12} md={6}>
            <div className='text-center mb-4'>
              <h2 className='mt-3'>Cryptocurrency Converter ASSIGNMENT 2</h2>
            </div>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group controlId='pairs'>
                {['BTC/USD', 'ETH/USD', 'LINK/USD', 'BTC/ETH'].map((pair, index) => (
                  <div key={index} className='mb-3'>
                    <Form.Check
                      id={index + 1}
                      type='radio'
                      label={pair}
                      value={pair}
                      checked={selectedPair === pair}
                      onChange={handlePairChange}
                    />
                  </div>
                ))}
              </Form.Group>
              <Button variant='danger' size='lg' onClick={fetchPairPrice}>
                Click Here to Convert
              </Button>
            </Form>
            {currentPrice !== '' && (
              <div className='mt-4'>
                <h3 className='text-center'>{selectedPair} ➡ {currentPrice}</h3>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
