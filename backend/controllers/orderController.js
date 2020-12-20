import Order from '../models/orderModel.js'
import AsyncHandler from "express-async-handler";

/**
 * @description Create new order
 * @route       POST /api/orders
 * @access      Private
 */
const addOrderItems = AsyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
    } = req.body;
    
    if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
        return
    }else{
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        })

        const createdOrder = await order.save()
        
        res.status(201).json(createdOrder)
    }
});

/**
 * @description Get order by ID
 * @route       GET /api/orders/:id
 * @access      Private
 */
const getOrderById = AsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(order){
        res.json(order)
    }else{
        res.status(404)
        throw new Error('Order not found')
    }
});

/**
 * @description Update order to paid
 * @route       GET /api/orders/:id/pay
 * @access      Private
 */
const updateOrderToPaid = AsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    }else{
        res.status(404)
        throw new Error('Order not found')
    }
});

/**
 * @description GET logged in user orders
 * @route       GET /api/orders/myorders
 * @access      Private
 */
const getMyOrders = AsyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id})
    res.json(orders)

});

/**
 * @description GET all user orders
 * @route       GET /api/orders
 * @access      Private/Admin
 */
const getOrders = AsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)

});


export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders
}
