import React, { useState } from 'react';
import './ReportPage.css';

const ReportPage = () => {
  const [image, setImage] = useState(null);
  const [issueType, setIssueType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please upload a valid image file.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, image: 'Image size must be less than 5MB.' });
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: '' }); // Clear image error
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!issueType) newErrors.issueType = 'Issue type is required.';
    if (!location) newErrors.location = 'Location is required.';
    if (!description) newErrors.description = 'Description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted with:', { image, issueType, location, description });
      // Submit data to backend or API
      alert('Issue reported successfully!');
      // Reset form
      setImage(null);
      setImagePreview(null);
      setIssueType('');
      setLocation('');
      setDescription('');
      setErrors({});
    }
  };

  return (
    <div className="ReportPage">
      <h2>Report an Issue</h2>
      <form onSubmit={handleSubmit} className="report-form">
        {/* Image Upload */}
        <label>
          Upload Image (optional):
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {errors.image && <span className="error-message">{errors.image}</span>}
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />
            </div>
          )}
        </label>

        {/* Issue Type */}
        <label>
          Issue Type:
          <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
            <option value="">Select Issue Type</option>
            <option value="Pothole">Pothole</option>
            <option value="Waterlogging">Waterlogging</option>
            <option value="Broken Road">Broken Road</option>
          </select>
          {errors.issueType && <span className="error-message">{errors.issueType}</span>}
        </label>

        {/* Location */}
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
          />
          {errors.location && <span className="error-message">{errors.location}</span>}
        </label>

        {/* Description */}
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </label>

        {/* Submit Button */}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default ReportPage;