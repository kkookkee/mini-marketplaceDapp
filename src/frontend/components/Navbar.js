import {Link} from "react-router-dom"
import { Navbar, Nav, Button, Container } from "react-bootstrap"
import nft from "./nft.png"

const Navigation = ({web3Handler,account}) => {
    return(
        <Navbar expand="lg" bg="primary" variant="dark">
            <Container>
                <Navbar.Brand>
                    <img src={nft} width="40" height="40" className="" alt="" />
                    &nbsp; NFT Marketplace
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar nav-dark bg-primary"></Navbar.Toggle>
                <Navbar.Collapse aria-controls="navbar nav-dark bg-primary">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/create">Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items">Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases">My purchases</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href = {`https://bscscan.com/address/${account}`}
                                target = "_blank"
                                rel = "noopener noreferrer"
                                className = "button nav-button btn-sm mx-4">
                                <Button>{account}</Button>
                            </Nav.Link>
                        ):(
                            <Button onClick={web3Handler}>Connect wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>       
    )
}

export default Navigation