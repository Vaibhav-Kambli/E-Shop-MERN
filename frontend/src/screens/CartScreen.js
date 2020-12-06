import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import {
	Row,
	Col,
	ListGroup,
	Image,
	Form,
	Button,
	Card,
} from "react-bootstrap";
import { addToCart } from "../actions/cartActions";

const CartScreen = ({match, location, history}) => {
    const productId = match.params.id
    
    const qty = location.search ? Number(location.search.split('=')[1]) : 1

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)

    const {cartItems} = cart

   

    useEffect(() =>{
        if(productId){
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch,productId,qty])


    const removeFromCartHandler = (id) => {
        console.log('Remove')
    }

    const checkoutHandler = () => {
        history.push('/login?redirect=shipping')
    }

	return <Row>
    
            <Col md={8}>

                <h1>Shopping Cart</h1>

                {cartItems.length === 0 ? <Message>Your cart is empty <Link to="/">Go Back</Link></Message> : (

                    <ListGroup variant="flush">

                  

                        {cartItems.map(cartItem => (
                            <ListGroup.Item key={cartItem.id}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={cartItem.img} alt={cartItem.name} fluid rounded/>
                                    </Col>

                                    <Col md={3}>
                                        <Link to={`/products/${cartItem.id}`}>{cartItem.name}</Link>
                                    </Col>

                                    <Col md={2}>${cartItem.price}</Col>
                                    <Col md={2}>
                                    <Form.Control as="select" value={cartItem.quantity} onChange={(e) => dispatch(addToCart( cartItem.id, Number(e.target.value)))}>
												{
													[...Array(cartItem.countInStock).keys()].map((x)=> (
														<option key={x + 1} value={x + 1}>
														{x + 1}
														</option>
													))
												}
											</Form.Control>

                                    </Col>

                                    <Col md={2}>

                                        <Button type='button' variant='light' onClick={() => removeFromCartHandler(cartItem.id)}>

                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}

                    </ListGroup>
                ) }
            </Col>
            
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">

                        <ListGroup.Item>
                            <h2>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)}) items</h2>

                            ${cartItems.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>Proceed to Checkout</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>

            </Col>

           
            
    
    </Row>;
};

export default CartScreen;
