const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * Generate QR code for vendor
 * @param {string} vendorId - Vendor ID
 * @param {string} baseUrl - Base URL for QR scan redirect
 * @returns {Promise<{qrCode: string, uniqueId: string}>}
 */
exports.generateVendorQR = async (vendorId, baseUrl = process.env.APP_URL) => {
  try {
    // Generate unique ID for this QR code
    const uniqueId = crypto.randomBytes(16).toString('hex');
    
    // Create QR data with vendor info
    const qrData = {
      vendorId,
      qrId: uniqueId,
      url: `${baseUrl}/scan/${vendorId}?qr=${uniqueId}`,
      type: 'vendor_qr',
      version: '1.0'
    };
    
    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 512
    });
    
    return {
      qrCode,
      uniqueId,
      scanUrl: qrData.url
    };
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

/**
 * Generate QR code for specific menu item
 * @param {string} vendorId - Vendor ID
 * @param {string} itemId - Menu item ID
 * @param {string} baseUrl - Base URL
 * @returns {Promise<string>}
 */
exports.generateItemQR = async (vendorId, itemId, baseUrl = process.env.APP_URL) => {
  try {
    const qrData = {
      vendorId,
      itemId,
      url: `${baseUrl}/order/${vendorId}/${itemId}`,
      type: 'item_qr',
      version: '1.0'
    };
    
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'L',
      type: 'image/png',
      width: 256
    });
    
    return qrCode;
  } catch (error) {
    throw new Error(`Failed to generate item QR code: ${error.message}`);
  }
};