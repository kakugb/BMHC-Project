const Partner = require('../models/partner.model.js');

exports.createPartner = async (req, res) => {
  try {
    const { 
      name, 
      specialty, 
      zip_code, 
      contact_info, 
      email, 
      address, 
      partner_type, 
      availability, 
      status 
    } = req.body;

    const newPartner = new Partner({
      name,
      specialty,
      zip_code,
      contact_info,
      email,
      address,
      partner_type,
      availability,
      status
    });

    await newPartner.save();
    res.status(201).json({ message: 'Partner created successfully', partner: newPartner });
  } catch (error) {
    res.status(500).json({ message: 'Error creating partner', error: error.message });
  }
};


exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find({});
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching partners', error: error.message });
  }
};


exports.singlePartner = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id);

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching partner', error: error.message });
  }
};


exports.updatePartner = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    const updatedPartner = await Partner.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedPartner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json({ message: 'Partner updated successfully', partner: updatedPartner });
  } catch (error) {
    res.status(500).json({ message: 'Error updating partner', error: error.message });
  }
};


exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params; 

    const deletedPartner = await Partner.findByIdAndDelete(id); 

    if (!deletedPartner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json({ message: 'Partner deleted successfully', partner: deletedPartner });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting partner', error: error.message });
  }
};


exports.filterPartners = async (req, res) => {
  try {
    const { name, specialty, email, availability, partner_type, status } = req.body;

   
    const filters = {};

    
    if (name) {
      filters.name = { $regex: name, $options: 'i' }; 
    }

    if (specialty) {
      filters.specialty = { $regex: specialty, $options: 'i' };
    }

    if (email) {
      filters.email = { $regex: email, $options: 'i' };
    }

    if (availability) {
      filters.availability = availability;
    }

    if (partner_type) {
      filters.partner_type = partner_type;
    }

    if (status) {
      filters.status = status;
    }

    // Query the database with the dynamically built filters
    const partners = await Partner.find(filters).limit(10); // Limiting results to 10 for performance

    if (partners.length === 0) {
      return res.status(404).json({ message: 'No partners found matching the criteria' });
    }

    // Return the filtered partners
    res.status(200).json(partners);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error filtering partners', error: error.message });
  }
};






exports.filterPartnersingle = async (req, res) => {
  try {
    const filters = req.body; // Expect exact filters in request body

    // Query the database with filters directly for exact matches
    const partners = await Partner.find(filters);

    if (partners.length === 0) {
      return res.status(404).json({ message: 'No partners found matching the criteria' });
    }

    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering partners', error: error.message });
  }
};