import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const SEATING_CONFIG = {
  sections: {
    'Premium Orchestra': { seats: 180, rows: 10, cols: 18, prefix: 'orch' },
    'Mezzanine': { seats: 230, rows: 10, cols: 23, prefix: 'mezz' },
    'Balcony': { seats: 176, rows: 8, cols: 22, prefix: 'balc' },
    'Box': { seats: 16, count: 4, perBox: 4, prefix: 'box' }
  },
  total: 602
};

export const useTheatreStore = create(
  persist(
    (set, get) => ({
      // --- Auth State ---
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // --- Data State ---
      patrons: [
        {
          id: 'MT-774021',
          firstName: 'Julian',
          lastName: 'Thorne',
          email: 'julian.thorne@prestige.com',
          phone: '+1 (555) 000-0000',
          address: '123 Performance Way',
          city: 'New York',
          state: 'NY',
          zip: '10023',
          tier: 'Gold',
          reservations: []
        },
        {
          id: 'MT-885032',
          firstName: 'Elena',
          lastName: 'Vance',
          email: 'elena.vance@arts.org',
          phone: '+1 (555) 111-2222',
          address: '456 Gallery Row',
          city: 'Brooklyn',
          state: 'NY',
          zip: '11201',
          tier: 'Silver',
          reservations: []
        }
      ],
      
      productions: [
        {
          id: 'prod-1',
          name: 'The Crimson Veil',
          type: 'Play',
          duration: '2h 15m',
          description: 'A dramatic masterpiece of mystery and shadows.',
          status: 'On Sale',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh4YAM-sAWjzOguQ0XCnepO-4aJItKLioNUe0u7Zm37zHql7_R7mJvhy4vifi8ipj1f1DPXq2XxL5TkPIxnm6W7EfshHX3c99K-SYPCyGboC-VEMRZhfaVRiF8ZCGWo74OUL8gvtdZysvl1vh4gQqaOg3OqVPoaQl3KjgXP6d0M29FjM3AlRC_Hs7E3B05aKyvs-tcgNmkHQKwHqELneK_DKj_kkrdNa716dWA5yp25Yy3WnAXyUMyAkKiFSXu7M25VKEHPaYZ6NVq'
        },
        {
          id: 'prod-2',
          name: 'Midnight Jazz Suite',
          type: 'Musical',
          duration: '2h 45m',
          description: 'An energetic journey through the golden age of jazz.',
          status: 'On Sale',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuMHSt88_3yyhZMwumTNtMiNdgVY-R5BgP-eA1laG7kOM3Aw2MwjQT4KESpb0WYtbObZ-Mv7aJBqGxzVGje_WosWGxik0ZXSlUXL8YdpXP5Q87CusvlUazYxcUjV4DP0kvWkD3qtMiBRab38TuQtkvoSLLq1c5EY5fdbIm8clInAlek6mLvXJN5uVx4NwFcIa5P1B9Xy8mWrtTqh83rGcFEWRKp-X6ahSGKRQN9wI_z5r2TulFBqdl3JXPhc5XBIfFn2d-9KGsDl6t'
        }
      ],

      performances: [
        { id: 'perf-1', productionId: 'prod-1', date: '2024-10-20', timeType: 'Evening', notes: 'Opening night' },
        { id: 'perf-2', productionId: 'prod-1', date: '2024-10-21', timeType: 'Matinee', notes: '' },
        { id: 'perf-3', productionId: 'prod-2', date: '2024-10-22', timeType: 'Evening', notes: '' }
      ],

      reservations: [],

      // --- Actions ---
      addPatron: (patron) => {
        const newPatron = { ...patron, id: `MT-${Math.floor(100000 + Math.random() * 900000)}` };
        set((state) => ({ patrons: [...state.patrons, newPatron] }));
        return newPatron;
      },
      
      updatePatron: (id, updates) => set((state) => ({
        patrons: state.patrons.map((p) => p.id === id ? { ...p, ...updates } : p)
      })),

      addProduction: (prod) => {
        const newProd = { 
          ...prod, 
          id: `prod-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        set((state) => ({ productions: [...state.productions, newProd] }));
        return newProd;
      },

      addPerformance: (perf) => {
        const newPerf = { ...perf, id: `perf-${Date.now()}` };
        set((state) => ({ performances: [...state.performances, newPerf] }));
        return newPerf;
      },

      updateProduction: (id, updates) => set((state) => ({
        productions: state.productions.map((p) => 
          p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
        )
      })),

      deleteProduction: (id) => {
        // Find all performances for this production
        const linkedPerfIds = get().performances
          .filter(p => p.productionId === id)
          .map(p => p.id);

        set((state) => ({
          // Remove the production
          productions: state.productions.filter((p) => p.id !== id),
          // Remove linked performances
          performances: state.performances.filter((p) => p.productionId !== id),
          // Cancel all reservations for those performances
          reservations: state.reservations.map((r) => 
            linkedPerfIds.includes(r.performanceId) ? { ...r, status: 'Cancelled' } : r
          )
        }));
        return { success: true };
      },

      updatePerformance: (id, updates) => set((state) => ({
        performances: state.performances.map((p) => p.id === id ? { ...p, ...updates } : p)
      })),

      deletePerformance: (id) => {
        set((state) => ({
          // Remove the performance
          performances: state.performances.filter((p) => p.id !== id),
          // Cancel all reservations for this specific performance
          reservations: state.reservations.map((r) => 
            r.performanceId === id ? { ...r, status: 'Cancelled' } : r
          )
        }));
        return { success: true };
      },

      addReservation: (res) => {
        const newRes = { 
          ...res, 
          id: `RES-${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        set((state) => ({ reservations: [...state.reservations, newRes] }));
        return newRes;
      },

      // --- Selectors ---
      getPatronById: (id) => get().patrons.find((p) => p.id === id),
      getProductionById: (id) => get().productions.find((p) => p.id === id),
      getPerformancesByProductionId: (prodId) => get().performances.filter((p) => p.productionId === prodId),
      getReservationsByPatronId: (patronId) => get().reservations.filter((r) => r.patronId === patronId),
      getReservationsByPerformanceId: (perfId) => get().reservations.filter((r) => r.performanceId === perfId),
      
      // Check if a seat is taken for a specific performance
      isSeatTaken: (perfId, seatId) => {
        const perfReservations = get().reservations.filter(r => r.performanceId === perfId && r.status !== 'Cancelled');
        return perfReservations.some(r => r.seats.includes(seatId));
      },

      deletePatron: (id) => set((state) => ({
        patrons: state.patrons.filter((p) => p.id !== id),
        reservations: state.reservations.filter((r) => r.patronId !== id)
      })),

      deleteReservation: (id) => set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id)
      })),

      // --- UI State ---
      modal: {
        isOpen: false,
        title: '',
        message: '',
        type: 'info', // 'info', 'confirm', 'success', 'error'
        onConfirm: null
      },
      setModal: (modal) => set({ modal: { ...get().modal, ...modal, isOpen: true } }),
      closeModal: () => set({ modal: { ...get().modal, isOpen: false, onConfirm: null } }),
    }),
    {
      name: 'medallion-theatre-storage',
    }
  )
);
