import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RevenueCardStats {
  totalRevenue: number;
  netRevenue: number;
  avgOrderValue: number;
  refundedAmount: number;
  isLoading: boolean;
  error: string | null;
}

export const useRevenueCards = () => {
  const [stats, setStats] = useState<RevenueCardStats>({
    totalRevenue: 0,
    netRevenue: 0,
    avgOrderValue: 0,
    refundedAmount: 0,
    isLoading: true,
    error: null
  });

  const calculateRevenueCards = async () => {
    try {
      setStats(prev => ({ ...prev, isLoading: true, error: null }));

      // 1. Total Revenue - Sum of all payments with status = 'Paid'
      const { data: paidPayments, error: paidError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'paid');

      if (paidError) throw paidError;

      const totalRevenue = paidPayments?.reduce((sum, payment) => 
        sum + Number(payment.amount), 0
      ) || 0;

      // 2. Refunded Amount - Sum of all payments with status = 'Refund'
      const { data: refundPayments, error: refundError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'refund');

      if (refundError) throw refundError;

      const refundedAmount = refundPayments?.reduce((sum, payment) => 
        sum + Number(payment.amount), 0
      ) || 0;

      // 3. Net Revenue - Total Revenue - Total Refunds
      const netRevenue = totalRevenue - refundedAmount;

      // 4. Count of Delivered/Completed Orders for AOV calculation
      const { data: deliveredOrders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .or('status.eq.delivered,status.eq.completed');

      if (ordersError) throw ordersError;

      const deliveredOrdersCount = deliveredOrders?.length || 0;

      // 5. Average Order Value - Net Revenue / Delivered Orders (avoid division by zero)
      const avgOrderValue = deliveredOrdersCount > 0 ? netRevenue / deliveredOrdersCount : 0;

      setStats({
        totalRevenue,
        netRevenue,
        avgOrderValue,
        refundedAmount,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error calculating revenue cards:', error);
      setStats(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  };

  useEffect(() => {
    calculateRevenueCards();

    // Set up real-time subscriptions for auto-sync
    const paymentsChannel = supabase
      .channel('revenue-cards-payments')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payments' 
      }, () => {
        calculateRevenueCards();
      })
      .subscribe();

    const ordersChannel = supabase
      .channel('revenue-cards-orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        calculateRevenueCards();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  return {
    ...stats,
    refresh: calculateRevenueCards
  };
};