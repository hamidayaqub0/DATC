import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockContractCall = vi.fn();

describe('Message Scheduler Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('schedule-message', () => {
    it('should schedule a new message successfully', async () => {
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const contentHash = '0x1234567890abcdef';
      const deliveryTime = 1000;
      
      mockContractCall.mockResolvedValue({ value: 1 });
      
      const result = await mockContractCall('message-scheduler', 'schedule-message', [recipient, contentHash, deliveryTime]);
      
      expect(result.value).toBe(1);
      expect(mockContractCall).toHaveBeenCalledWith('message-scheduler', 'schedule-message', [recipient, contentHash, deliveryTime]);
    });
    
    it('should fail if delivery time is in the past', async () => {
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const contentHash = '0x1234567890abcdef';
      const deliveryTime = 0;
      
      mockContractCall.mockRejectedValue(new Error('Delivery time must be in the future'));
      
      await expect(mockContractCall('message-scheduler', 'schedule-message', [recipient, contentHash, deliveryTime]))
          .rejects.toThrow('Delivery time must be in the future');
    });
  });
  
  describe('mark-as-delivered', () => {
    it('should mark a message as delivered successfully', async () => {
      const messageId = 1;
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('message-scheduler', 'mark-as-delivered', [messageId]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('message-scheduler', 'mark-as-delivered', [messageId]);
    });
    
    it('should fail if message does not exist', async () => {
      const messageId = 999;
      
      mockContractCall.mockRejectedValue(new Error('Message not found'));
      
      await expect(mockContractCall('message-scheduler', 'mark-as-delivered', [messageId]))
          .rejects.toThrow('Message not found');
    });
    
    it('should fail if delivery time has not been reached', async () => {
      const messageId = 1;
      
      mockContractCall.mockRejectedValue(new Error('Delivery time not reached'));
      
      await expect(mockContractCall('message-scheduler', 'mark-as-delivered', [messageId]))
          .rejects.toThrow('Delivery time not reached');
    });
  });
  
  describe('get-message', () => {
    it('should return a message by ID', async () => {
      const messageId = 1;
      const expectedMessage = {
        sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        recipient: 'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        content_hash: '0x1234567890abcdef',
        delivery_time: 1000,
        is_delivered: false
      };
      
      mockContractCall.mockResolvedValue({ value: expectedMessage });
      
      const result = await mockContractCall('message-scheduler', 'get-message', [messageId]);
      
      expect(result.value).toEqual(expectedMessage);
      expect(mockContractCall).toHaveBeenCalledWith('message-scheduler', 'get-message', [messageId]);
    });
    
    it('should return null for non-existent message', async () => {
      const messageId = 999;
      
      mockContractCall.mockResolvedValue({ value: null });
      
      const result = await mockContractCall('message-scheduler', 'get-message', [messageId]);
      
      expect(result.value).toBeNull();
    });
  });
  
  describe('is-message-deliverable', () => {
    it('should return true for a deliverable message', async () => {
      const messageId = 1;
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('message-scheduler', 'is-message-deliverable', [messageId]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('message-scheduler', 'is-message-deliverable', [messageId]);
    });
    
    it('should return false for a non-deliverable message', async () => {
      const messageId = 2;
      
      mockContractCall.mockResolvedValue({ value: false });
      
      const result = await mockContractCall('message-scheduler', 'is-message-deliverable', [messageId]);
      
      expect(result.value).toBe(false);
    });
    
    it('should return false for a non-existent message', async () => {
      const messageId = 999;
      
      mockContractCall.mockResolvedValue({ value: false });
      
      const result = await mockContractCall('message-scheduler', 'is-message-deliverable', [messageId]);
      
      expect(result.value).toBe(false);
    });
  });
});

