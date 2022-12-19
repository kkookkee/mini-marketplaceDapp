import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Col, Row, Form, Button, Card } from 'react-bootstrap';

export default function MyPurchases({marketplace,nft,account}) {
    const [loading,setLoading] = useState(true)
    const [purchases, setPurchases] = useState([])
    const loadPurchasedItems = async () => {
        const filter = marketplace.filters.Bought(null,null,null,null,null,account)
        const result = await marketplace.queryFilter(filter)
        const purchases = await Promise.all(result.map(async i=> {
            i = i.args
            const uri = await nft.tokenURI(i.tokenId)
            const response = await fetch(uri)
            const metadata = await response.json()
            const totalPrice = await marketplace.getTotalPrice(i.itemId)
            let purchaseItem = {
                totalPrice,
                price: i.price,
                itemId: metadata.name,
                description: metadata.description,
                image: metadata.image,
            }
            return purchaseItem;
        }))
        setLoading(false)
        setPurchases(purchases)
    }
    useEffect(() => {
        loadPurchasedItems()
    }, [])
    return (
        <div className='flex justify-center'>
            {purchases.length > 0 ?
                <div className='px-5 py-3 container'>
                    <Row xs={1} md={2} lg={4} className="g-4 py-3">
                        {purchases.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Img variant="top" src={item.image}></Card.Img>
                                    <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} Eth </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div> 
                : (
                    <main style={{padding: "1rem 0"}}>
                        <h2>No purchases</h2>
                    </main>
                )}
            
        </div>
    )
}



