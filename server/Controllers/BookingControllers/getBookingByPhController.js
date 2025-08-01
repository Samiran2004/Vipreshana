const Models = require("../../Models/index.models");

const getBookingByPhoneController = async (req, res) => {
    const { phone } = req.params;

    console.log('🔍 Fetching bookings for phone:', phone);
    console.log('📋 Request params:', req.params);

    try {
        console.log('🔗 Attempting database query...');
        console.log('📊 BookingSchema:', Models.BookingSchema);
        
        // First, let's check if there are any bookings at all in the database
        const allBookings = await Models.BookingSchema.find({});
        console.log('📊 Total bookings in database:', allBookings.length);
        if (allBookings.length > 0) {
            console.log('📊 Sample booking phone numbers:', allBookings.slice(0, 3).map(b => b.phone));
        }
        
        const bookings = await Models.BookingSchema.find({ phone });
        console.log('✅ Database query completed');
        console.log('📦 Found bookings for phone', phone + ':', bookings.length);
        
        if (bookings.length === 0) {
            console.log('❌ No bookings found for phone:', phone);
            return res.status(404).json({ message: 'No bookings found for this phone number' });
        }
        
        console.log('✅ Returning bookings:', bookings);
        res.status(200).json(bookings);
    } catch (error) {
        console.error('❌ Error fetching bookings:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
    }
}

module.exports = getBookingByPhoneController;