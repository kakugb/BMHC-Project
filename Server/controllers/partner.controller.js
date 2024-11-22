const Partner = require('../models/partner.model.js');
const mongoose = require('mongoose'); 
exports.createPartner = async (req, res) => {
  try {
    const { 
      name, 
      telephone, 
      email, 
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

    const existingPartner = await Partner.findOne({ email }); 
    if (existingPartner) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const newPartner = new Partner({
      name,
      telephone,
      email,
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
    console.error('Error updating partner:', error); 
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }



    const partner = await Partner.findById(id);

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json(partner);
  } catch (error) {
    console.error('Error fetching partner:', error.message); // Optional: Log error for debugging
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

    let filterQuery = {};

    if (gender && gender.length > 0) filterQuery.gender = { $in: gender };
    if (age_range && age_range.length > 0) filterQuery.age_range = { $in: age_range };
    if (citizenship_status && citizenship_status.length > 0) filterQuery.citizenship_status = { $in: citizenship_status };
    if (insurance && insurance.length > 0) filterQuery.insurance = { $in: insurance };
    if (zip_code && zip_code.length > 0) filterQuery.zip_code = { $in: zip_code };
    if (physical && physical.length > 0) filterQuery.physical = { $in: physical };
    if (mental && mental.length > 0) filterQuery.mental = { $in: mental };
    if (social_determinants_of_health && social_determinants_of_health.length > 0) 
      filterQuery.social_determinants_of_health = { $in: social_determinants_of_health };
    if (offers_transportation && offers_transportation.length > 0) 
      filterQuery.offers_transportation = { $in: offers_transportation };
    if (emergency_room && emergency_room.length > 0) filterQuery.emergency_room = { $in: emergency_room };

    if (Object.keys(filterQuery).length === 0) {
      return res.status(400).json({ message: 'At least one filter is required' });
    }
    const partners = await Partner.find(filterQuery);

    if (partners.length === 0) {
      return res.status(404).json({ message: 'No partners found matching the criteria' });
    }
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering partners', error: error.message });
  }
};




exports.filterPartnerByName = async (req, res) => {
  try {
    const { name, email } = req.body;  
    
    if (!name && !email) {
      return res.status(400).json({ message: 'Please provide either name or email to filter' });
    }

    const filterQuery = {};
    if (name) {
      filterQuery.name = { $regex: name, $options: 'i' }; 
    }

    if (email) {
      filterQuery.email = { $regex: email, $options: 'i' };  
    }

    const partners = await Partner.find(filterQuery);
    if (partners.length === 0) {
      return res.status(404).json({ message: 'No partners found matching the criteria' });
    }

    res.status(200).json(partners);

  } catch (error) {
    res.status(500).json({ message: 'Error filtering partners', error: error.message });
  }
};


