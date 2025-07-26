const Models = require("../../Models/index.models");

const createBookingController = async (req, res) => {
    const { name, phone, pickupLocation, dropoffLocation, vehicleType, estimatedCost } = req.body;

    console.log('📝 Creating new booking...');
    console.log('📋 Booking data:', { name, phone, pickupLocation, dropoffLocation, vehicleType, estimatedCost });

    try {
        const newBooking = new Models.BookingSchema({
            name,
            phone,
            pickupLocation,
            dropoffLocation,
            vehicleType,
            estimatedCost,
        });

        console.log('💾 Saving booking to database...');
        await newBooking.save();
        console.log('✅ Booking saved successfully:', newBooking);
        
        res.status(200).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        console.error('❌ Error saving booking:', error);
        console.error('❌ Error details:', error.message);
        res.status(500).json({ error: 'Error saving booking', details: error.message });
    }
}

module.exports = createBookingController;