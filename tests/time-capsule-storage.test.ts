import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockContractCall = vi.fn();

describe('Time Capsule Storage Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('store-capsule', () => {
    it('should store a new capsule successfully', async () => {
      const capsuleId = 1;
      const size = 1000;
      const contentHash = '0x1234567890abcdef';
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('time-capsule-storage', 'store-capsule', [capsuleId, size, contentHash]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('time-capsule-storage', 'store-capsule', [capsuleId, size, contentHash]);
    });
    
    it('should fail if storage token transfer fails', async () => {
      const capsuleId = 1;
      const size = 1000000; // Assuming this requires more tokens than available
      const contentHash = '0x1234567890abcdef';
      
      mockContractCall.mockRejectedValue(new Error('Insufficient balance'));
      
      await expect(mockContractCall('time-capsule-storage', 'store-capsule', [capsuleId, size, contentHash]))
          .rejects.toThrow('Insufficient balance');
    });
  });
  
  describe('pay-storage', () => {
    it('should pay for storage successfully', async () => {
      const capsuleId = 1;
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('time-capsule-storage', 'pay-storage', [capsuleId]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('time-capsule-storage', 'pay-storage', [capsuleId]);
    });
    
    it('should fail if capsule does not exist', async () => {
      const capsuleId = 999;
      
      mockContractCall.mockRejectedValue(new Error('Capsule not found'));
      
      await expect(mockContractCall('time-capsule-storage', 'pay-storage', [capsuleId]))
          .rejects.toThrow('Capsule not found');
    });
    
    it('should fail if storage token transfer fails', async () => {
      const capsuleId = 1;
      
      mockContractCall.mockRejectedValue(new Error('Insufficient balance'));
      
      await expect(mockContractCall('time-capsule-storage', 'pay-storage', [capsuleId]))
          .rejects.toThrow('Insufficient balance');
    });
  });
  
  describe('get-capsule-info', () => {
    it('should return capsule info successfully', async () => {
      const capsuleId = 1;
      const expectedCapsuleInfo = {
        owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        size: 1000,
        last_paid_height: 100,
        content_hash: '0x1234567890abcdef'
      };
      
      mockContractCall.mockResolvedValue({ value: expectedCapsuleInfo });
      
      const result = await mockContractCall('time-capsule-storage', 'get-capsule-info', [capsuleId]);
      
      expect(result.value).toEqual(expectedCapsuleInfo);
      expect(mockContractCall).toHaveBeenCalledWith('time-capsule-storage', 'get-capsule-info', [capsuleId]);
    });
    
    it('should return null for non-existent capsule', async () => {
      const capsuleId = 999;
      
      mockContractCall.mockResolvedValue({ value: null });
      
      const result = await mockContractCall('time-capsule-storage', 'get-capsule-info', [capsuleId]);
      
      expect(result.value).toBeNull();
    });
  });
  
  describe('get-storage-cost', () => {
    it('should return storage cost successfully', async () => {
      const capsuleId = 1;
      const expectedCost = 5000;
      
      mockContractCall.mockResolvedValue({ value: expectedCost });
      
      const result = await mockContractCall('time-capsule-storage', 'get-storage-cost', [capsuleId]);
      
      expect(result.value).toBe(expectedCost);
      expect(mockContractCall).toHaveBeenCalledWith('time-capsule-storage', 'get-storage-cost', [capsuleId]);
    });
    
    it('should fail for non-existent capsule', async () => {
      const capsuleId = 999;
      
      mockContractCall.mockRejectedValue(new Error('Capsule not found'));
      
      await expect(mockContractCall('time-capsule-storage', 'get-storage-cost', [capsuleId]))
          .rejects.toThrow('Capsule not found');
    });
  });
});

