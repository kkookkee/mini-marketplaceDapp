import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Col, Row, Form, Button, Card } from 'react-bootstrap';

function renderSoldItems(items){
    return (
        <>
            <h2>Sold</h2>
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
                {items.map((item, idx) => (
                    <Col key={idx} className="overflow-hidden">
                        <Card>
                            <Card.Img variant="top" src={item.image}></Card.Img>
                            <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} Eth </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default function MyListedItems({ marketplace, nft, account }) {
    const [loading, setLoading] = useState(true)
    const [listedItems, setListedItems] = useState([])
    const [soldItems, setSoldItems] = useState([])

    const loadListedItems = async () => {
        const itemCount = await marketplace.itemCount();
        let listedItems = [];
        let soldItems = [];
        for (let index = 0; index <= itemCount; index++) {
            const i = await marketplace.items(index)
            if (i.seller.toLowerCase() === account) {
                const uri = await nft.tokenURI(i.tokenId)
                const response = await fetch(uri)
                const metadata = await response.json()
                const totalPrice = await marketplace.getTotalPrice(i.itemId)
                let item = {
                    totalPrice,
                    price: i.price,
                    itemId: i.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                }
                listedItems.push(item)
                if (i.sold) {
                    soldItems.push(item)
                }
            }
        }
        setLoading(false)
        setListedItems(listedItems)
        setSoldItems(soldItems)
    }
    useEffect(() => {
        loadListedItems()
    }, [])
    if (loading) {
        return (
            <main style={{ padding: "1rem 0" }}>
                <h2>Loading...</h2>
            </main>
        )
    }
    return (
        <div className='flex justify-center'>
            {listedItems.length > 0 ?
                <div className='px-5 py-3 container'>
                    <Row xs={1} md={2} lg={4} className="g-4 py-3">
                        {listedItems.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Img variant="top" src={item.image}></Card.Img>
                                    <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} Eth </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    {soldItems.length > 0 && renderSoldItems(soldItems)}
                </div> 
                : (
                    <main style={{padding: "1rem 0"}}>
                        <h2>No sold items</h2>
                    </main>
                )}
            
        </div>
    )
}