const Partner = require('../models/partner.model.js');

exports.createPartner = async (req, res) => {
  try {
    const { 
      name, 
      telephone, 
      contact, 
      address, 
      gender, 
      age_range, 
      citizenship_status, 
      insurance, 
      zip_code, 
      physical, 
      mental, 
      social_determinants_of_health, 
      offers_transportation, 
      emergency_room 
    } = req.body;

    const newPartner = new Partner({
      name,
      telephone,
      contact,
      address,
      gender,
      age_range,
      citizenship_status,
      insurance,
      zip_code,
      physical,
      mental,
      social_determinants_of_health,
      offers_transportation,
      emergency_room
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


exports.filterPartners = async (req, res) => {
  try {
    const { 
      gender, 
      age_range, 
      citizenship_status, 
      insurance, 
      zip_code, 
      physical, 
      mental, 
      social_determinants_of_health, 
      offers_transportation, 
      emergency_room 
    } = req.body;

    const filters = {};

    if (gender) filters.gender = gender;
    if (age_range) filters.age_range = age_range;
    if (citizenship_status) filters.citizenship_status = citizenship_status;
    if (insurance) filters.insurance = insurance;
    if (zip_code) filters.zip_code = zip_code;
    if (physical) filters.physical = physical;
    if (mental) filters.mental = mental;
    if (social_determinants_of_health) filters.social_determinants_of_health = social_determinants_of_health;
    if (offers_transportation) filters.offers_transportation = offers_transportation;
    if (emergency_room) filters.emergency_room = emergency_room;

    const partners = await Partner.find(filters);

    if (partners.length === 0) {
      return res.status(404).json({ message: 'No partners found matching the criteria' });
    }

    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering partners', error: error.message });
  }
};

exports.filterPartnerssingle = async (req, res) => {
  try {
    const filters = req.body;

    // Validate that the filters object is not empty
    if (Object.keys(filters).length === 0) {
      return res.status(400).json({ message: 'No filter criteria provided' });
    }

    // Check if the filters contain a search term for text-based search (name, email, etc.)
    const filterQuery = {};

    // You can adjust this depending on what fields you expect in the filter
    if (filters.name) {
      filterQuery.name = { $regex: filters.name, $options: 'i' };  // case-insensitive search
    }
    if (filters.email) {
      filterQuery.email = { $regex: filters.email, $options: 'i' };  // case-insensitive search
    }
    if (filters.telephone) {
      filterQuery.telephone = { $regex: filters.telephone, $options: 'i' };
    }
    if (filters.zip_code) {
      filterQuery.zip_code = filters.zip_code;
    }
    if (filters.status) {
      filterQuery.status = filters.status;
    }

    // Query MongoDB using the dynamically created filterQuery
    const partners = await Partner.find(filterQuery);

    if (partners.length === 0) {
      return res.status(404).json({ message: 'No partners found matching the criteria' });
    }

    // Return filtered partners
    res.status(200).json(partners);

  } catch (error) {
    res.status(500).json({ message: 'Error filtering partners', error: error.message });
  }
};

