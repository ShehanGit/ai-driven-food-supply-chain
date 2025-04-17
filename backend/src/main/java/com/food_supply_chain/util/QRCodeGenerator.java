package com.food_supply_chain.util;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class QRCodeGenerator {

    // In a real implementation, we would use a library like ZXing to generate actual QR code images
    // For this example, we'll simulate it by generating URLs that would normally point to real QR code images

    private static final String QR_CODE_BASE_URL = "https://synerharvest.com/qr/";

    /**
     * Generates a QR code for a product
     * @param productId The product ID
     * @param batchCode The batch code
     * @return URL of the generated QR code
     */
    public String generateProductQRCode(Long productId, String batchCode) {
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        return QR_CODE_BASE_URL + "product/" + productId + "/" + uniqueId;
    }

    /**
     * Generates a QR code for a batch
     * @param batchId The batch ID
     * @param batchCode The batch code
     * @return URL of the generated QR code
     */
    public String generateBatchQRCode(Long batchId, String batchCode) {
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        return QR_CODE_BASE_URL + "batch/" + batchId + "/" + uniqueId;
    }

    /**
     * Simulated method to generate a QR code with embedded data
     * @param data Map of key-value pairs to encode in the QR code
     * @return URL of the generated QR code
     */
    public String generateQRCodeWithData(Map<String, String> data) {
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        return QR_CODE_BASE_URL + "data/" + uniqueId;
    }

    /**
     * Generate batch code with timestamp and prefixes
     * @param prefix Prefix for the batch code (e.g., product type)
     * @return Generated batch code
     */
    public String generateBatchCode(String prefix) {
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(5);
        return prefix + "-" + timestamp;
    }
}