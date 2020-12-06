import { CART_ADD_ITEM } from '../constants/cartConstants'
import axios from 'axios'

export const addToCart =(id, quantity) => async (dispatch, getState) => {
    const {data} = await axios.get(`/api/products/${id}`)

    dispatch({
        type: CART_ADD_ITEM,
        payload : {
            id: data._id,
            name: data.name,
            img: data.image,
            price: data.price,
            countInStock: data.countInStock,
            quantity
        }
    
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}