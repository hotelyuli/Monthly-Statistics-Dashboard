import { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";

const C = {
  darkWine: "#4D333E",
  terracotta: "#C97B77",
  cream: "#FAF8F5",
  blush: "#F0EAE4",
  white: "#FFFFFF",
  dark: "#1A1A1A",
  muted: "#8A7A72",
  positive: "#2D7A4F",
  negative: "#C4312D",
  warning: "#E8A838",
  border: "#E8E0D8",
};
const PIE_COLORS = ["#4D333E","#C97B77","#8A7A72","#2D7A4F","#E8A838","#4A6FA5","#9B6B8E","#D4956A"];
const fmt = n => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = n => n.toLocaleString("en-US");

const DIRECT_CH = ["Extranet", "Simple Booking", "Mobile App", "Direct Booking"];

const DATA = {
  "Jan 2026": {
    days: 31,
    summary: { roomRevenue: 54154.94, tax: 7025, totalWithTax: 61179.94, reservations: 270, nights: 676, occupancy: 89, adr: 80.11, lead: 34, stay: 2, revpar: 71.63 },
    channels: [
      { name: "Extranet", revenue: 23372.41, res: 90, canc: 10, nights: 312, adr: 74.91 },
      { name: "Booking.com", revenue: 18939.17, res: 113, canc: 31, nights: 214, adr: 88.50 },
      { name: "Simple Booking", revenue: 3684.45, res: 17, canc: 1, nights: 36, adr: 102.35 },
      { name: "Expedia", revenue: 3626.29, res: 22, canc: 10, nights: 39, adr: 92.98 },
      { name: "Mobile App", revenue: 2775.36, res: 16, canc: 1, nights: 35, adr: 79.30 },
      { name: "Hostelworld", revenue: 1579.66, res: 11, canc: 2, nights: 38, adr: 41.57 },
      { name: "Airbnb", revenue: 177.60, res: 1, canc: 1, nights: 2, adr: 88.80 },
    ],
    roomTypes: [
      { name: "Queen Pool View", revenue: 13604.76, res: 69, nights: 144, occ: 94, adr: 94.48, revpar: 88.34 },
      { name: "Triple (3 Single)", revenue: 9462.58, res: 38, nights: 91, occ: 99, adr: 103.98, revpar: 102.85 },
      { name: "King Pool Access", revenue: 8161.06, res: 39, nights: 88, occ: 95, adr: 92.74, revpar: 87.75 },
      { name: "Suite w/ Balcony", revenue: 6196.59, res: 30, nights: 59, occ: 95, adr: 105.03, revpar: 99.95 },
      { name: "Micro Queen", revenue: 4662.47, res: 36, nights: 59, occ: 95, adr: 79.02, revpar: 75.20 },
      { name: "Bunk Beds (Dorm)", revenue: 4167.44, res: 37, nights: 131, occ: 74, adr: 31.81, revpar: 23.41 },
      { name: "1BR Apartment", revenue: 2838.14, res: 15, nights: 36, occ: 116, adr: 78.84, revpar: 91.55 },
      { name: "Twin Pool View", revenue: 2572.60, res: 20, nights: 29, occ: 94, adr: 88.71, revpar: 82.99 },
      { name: "Micro Twin", revenue: 2489.30, res: 23, nights: 39, occ: 74, adr: 63.83, revpar: 46.97 },
    ],
    rooms: [
      { name:"Room 18",revenue:3369.28,nights:31,occ:100,adr:108.69,revpar:108.69 },
      { name:"Room 10",revenue:3218.98,nights:31,occ:100,adr:103.84,revpar:103.84 },
      { name:"Room 15",revenue:3190.21,nights:30,occ:97,adr:106.34,revpar:102.91 },
      { name:"Room 19",revenue:3006.38,nights:29,occ:94,adr:103.67,revpar:96.98 },
      { name:"Room 4",revenue:2957.98,nights:30,occ:97,adr:98.60,revpar:95.42 },
      { name:"Room 13",revenue:2874.32,nights:29,occ:97,adr:99.11,revpar:95.81 },
      { name:"Room 2",revenue:2858.65,nights:31,occ:100,adr:92.21,revpar:92.21 },
      { name:"Room 3",revenue:2828.61,nights:30,occ:97,adr:94.29,revpar:91.25 },
      { name:"Room 14",revenue:2820.49,nights:29,occ:94,adr:97.26,revpar:90.98 },
      { name:"Room 11",revenue:2725.08,nights:30,occ:97,adr:90.84,revpar:87.91 },
      { name:"Room 9",revenue:2700.56,nights:25,occ:81,adr:108.02,revpar:87.11 },
      { name:"Room 6",revenue:2572.60,nights:29,occ:94,adr:88.71,revpar:82.99 },
      { name:"Room 12",revenue:2481.92,nights:28,occ:90,adr:88.64,revpar:80.06 },
      { name:"Room 17",revenue:2446.10,nights:30,occ:97,adr:81.54,revpar:78.91 },
      { name:"Room 1",revenue:2413.36,nights:30,occ:97,adr:80.45,revpar:77.85 },
      { name:"Room 5",revenue:2392.53,nights:29,occ:97,adr:82.50,revpar:79.75 },
      { name:"Room 7",revenue:2216.37,nights:29,occ:94,adr:76.43,revpar:71.50 },
      { name:"Room 8",revenue:1301.29,nights:18,occ:72,adr:72.29,revpar:52.05 },
      { name:"Room 16",revenue:1188.01,nights:21,occ:75,adr:56.57,revpar:42.43 },
      { name:"Bed 1",revenue:819.32,nights:26,occ:84,adr:31.51,revpar:26.43 },
      { name:"Bed 5",revenue:728.31,nights:22,occ:76,adr:33.11,revpar:25.11 },
      { name:"Bed 3",revenue:721.02,nights:24,occ:80,adr:30.04,revpar:24.03 },
      { name:"Bed 6",revenue:676.16,nights:21,occ:70,adr:32.20,revpar:22.54 },
      { name:"Bed 2",revenue:641.31,nights:19,occ:66,adr:33.75,revpar:22.11 },
      { name:"Bed 4",revenue:581.32,nights:19,occ:66,adr:30.60,revpar:20.05 },
    ],
  },
  "Feb 2026": {
    days: 28,
    summary: { roomRevenue: 53630.06, tax: 6956.31, totalWithTax: 60586.37, reservations: 258, nights: 635, occupancy: 92, adr: 84.46, lead: 27, stay: 2, revpar: 77.95 },
    channels: [
      { name: "Extranet", revenue: 26321.84, res: 108, canc: 11, nights: 334, adr: 78.81 },
      { name: "Booking.com", revenue: 19236.13, res: 109, canc: 28, nights: 208, adr: 92.48 },
      { name: "Expedia", revenue: 2515.17, res: 14, canc: 7, nights: 26, adr: 96.74 },
      { name: "Mobile App", revenue: 2484.38, res: 9, canc: 0, nights: 30, adr: 82.81 },
      { name: "Simple Booking", revenue: 2444.06, res: 10, canc: 0, nights: 21, adr: 116.38 },
      { name: "Hostelworld", revenue: 628.48, res: 8, canc: 3, nights: 16, adr: 39.28 },
    ],
    roomTypes: [
      { name: "Queen Pool View", revenue: 13801.67, res: 57, nights: 136, occ: 98, adr: 101.48, revpar: 99.29 },
      { name: "Triple (3 Single)", revenue: 8738.86, res: 38, nights: 80, occ: 95, adr: 109.24, revpar: 104.03 },
      { name: "King Pool Access", revenue: 8307.97, res: 40, nights: 82, occ: 100, adr: 101.32, revpar: 101.32 },
      { name: "Suite w/ Balcony", revenue: 5388.97, res: 24, nights: 53, occ: 95, adr: 101.68, revpar: 96.23 },
      { name: "Micro Queen", revenue: 5111.30, res: 30, nights: 55, occ: 100, adr: 92.93, revpar: 92.93 },
      { name: "Bunk Beds (Dorm)", revenue: 4360.98, res: 62, nights: 132, occ: 80, adr: 33.04, revpar: 26.27 },
      { name: "Twin Pool View", revenue: 2756.32, res: 14, nights: 28, occ: 104, adr: 98.44, revpar: 102.09 },
      { name: "1BR Apartment", revenue: 2655.41, res: 14, nights: 25, occ: 89, adr: 106.22, revpar: 94.84 },
      { name: "Micro Twin", revenue: 2508.59, res: 24, nights: 44, occ: 86, adr: 57.01, revpar: 49.19 },
    ],
    rooms: [
      { name:"Room 4",revenue:3182.18,nights:28,occ:100,adr:113.65,revpar:113.65 },
      { name:"Room 14",revenue:3127.23,nights:28,occ:100,adr:111.69,revpar:111.69 },
      { name:"Room 10",revenue:3051.32,nights:27,occ:96,adr:113.01,revpar:108.98 },
      { name:"Room 3",revenue:2818.49,nights:28,occ:100,adr:100.66,revpar:100.66 },
      { name:"Room 2",revenue:2807.41,nights:28,occ:100,adr:100.26,revpar:100.26 },
      { name:"Room 18",revenue:2806.20,nights:27,occ:96,adr:103.93,revpar:100.22 },
      { name:"Room 19",revenue:2800.97,nights:27,occ:96,adr:103.74,revpar:100.03 },
      { name:"Room 13",revenue:2704.34,nights:24,occ:86,adr:112.68,revpar:96.58 },
      { name:"Room 1",revenue:2655.41,nights:25,occ:89,adr:106.22,revpar:94.84 },
      { name:"Room 9",revenue:2640.91,nights:26,occ:96,adr:101.57,revpar:97.81 },
      { name:"Room 6",revenue:2638.32,nights:27,occ:100,adr:97.72,revpar:97.72 },
      { name:"Room 15",revenue:2588.00,nights:26,occ:93,adr:99.54,revpar:92.43 },
      { name:"Room 11",revenue:2562.70,nights:27,occ:96,adr:94.91,revpar:91.53 },
      { name:"Room 17",revenue:2562.18,nights:27,occ:100,adr:94.90,revpar:94.90 },
      { name:"Room 7",revenue:2549.12,nights:28,occ:100,adr:91.04,revpar:91.04 },
      { name:"Room 5",revenue:2519.39,nights:26,occ:93,adr:96.90,revpar:89.98 },
      { name:"Room 12",revenue:2373.32,nights:26,occ:100,adr:91.28,revpar:91.28 },
      { name:"Room 16",revenue:1365.00,nights:25,occ:96,adr:54.60,revpar:52.50 },
      { name:"Room 8",revenue:1143.59,nights:19,occ:76,adr:60.19,revpar:45.74 },
      { name:"Bed 1",revenue:882.26,nights:28,occ:100,adr:31.51,revpar:31.51 },
      { name:"Bed 2",revenue:821.52,nights:21,occ:75,adr:39.12,revpar:29.34 },
      { name:"Bed 5",revenue:767.87,nights:26,occ:96,adr:29.53,revpar:28.44 },
      { name:"Bed 3",revenue:723.48,nights:23,occ:82,adr:31.46,revpar:25.84 },
      { name:"Bed 4",revenue:662.80,nights:20,occ:74,adr:33.14,revpar:24.55 },
      { name:"Bed 6",revenue:503.05,nights:14,occ:50,adr:35.93,revpar:17.97 },
    ],
  },
  "Mar 2026": {
    days: 31,
    summary: { roomRevenue: 52978.67, tax: 6887.23, totalWithTax: 59865.90, reservations: 287, nights: 656, occupancy: 85, adr: 80.76, lead: 26, stay: 2, revpar: 68.98 },
    channels: [
      { name: "Booking.com", revenue: 24994.72, res: 137, canc: 30, nights: 288, adr: 86.79 },
      { name: "Extranet", revenue: 14815.71, res: 103, canc: 23, nights: 196, adr: 75.59 },
      { name: "Mobile App", revenue: 5170.00, res: 10, canc: 3, nights: 80, adr: 64.63 },
      { name: "Simple Booking", revenue: 4610.55, res: 19, canc: 1, nights: 51, adr: 90.40 },
      { name: "Expedia", revenue: 2231.16, res: 9, canc: 5, nights: 23, adr: 97.01 },
      { name: "Hostelworld", revenue: 692.53, res: 8, canc: 0, nights: 14, adr: 49.47 },
      { name: "Direct Booking", revenue: 464.00, res: 1, canc: 1, nights: 4, adr: 116.00 },
    ],
    roomTypes: [
      { name: "Queen Pool View", revenue: 13580.11, res: 68, nights: 152, occ: 99, adr: 89.34, revpar: 88.18 },
      { name: "Triple (3 Single)", revenue: 9895.73, res: 38, nights: 86, occ: 93, adr: 115.07, revpar: 107.56 },
      { name: "King Pool Access", revenue: 7647.14, res: 42, nights: 88, occ: 97, adr: 86.90, revpar: 84.03 },
      { name: "Suite w/ Balcony", revenue: 5968.92, res: 32, nights: 58, occ: 95, adr: 102.91, revpar: 97.85 },
      { name: "Micro Queen", revenue: 4791.23, res: 27, nights: 59, occ: 95, adr: 81.21, revpar: 77.28 },
      { name: "Bunk Beds (Dorm)", revenue: 3710.19, res: 48, nights: 101, occ: 55, adr: 36.73, revpar: 20.16 },
      { name: "1BR Apartment", revenue: 2714.53, res: 17, nights: 30, occ: 97, adr: 90.48, revpar: 87.57 },
      { name: "Twin Pool View", revenue: 2529.86, res: 15, nights: 27, occ: 87, adr: 93.70, revpar: 81.61 },
      { name: "Micro Twin", revenue: 2140.96, res: 23, nights: 55, occ: 89, adr: 38.93, revpar: 34.53 },
    ],
    rooms: [
      { name:"Room 18",revenue:3530.50,nights:30,occ:97,adr:117.68,revpar:113.89 },
      { name:"Room 10",revenue:3413.86,nights:30,occ:97,adr:113.80,revpar:110.12 },
      { name:"Room 15",revenue:3218.70,nights:31,occ:100,adr:103.83,revpar:103.83 },
      { name:"Room 4",revenue:3031.30,nights:30,occ:100,adr:101.04,revpar:101.04 },
      { name:"Room 13",revenue:2951.38,nights:26,occ:87,adr:113.51,revpar:98.38 },
      { name:"Room 9",revenue:2786.90,nights:30,occ:97,adr:92.90,revpar:89.90 },
      { name:"Room 19",revenue:2750.22,nights:27,occ:90,adr:101.86,revpar:91.67 },
      { name:"Room 14",revenue:2717.67,nights:31,occ:100,adr:87.67,revpar:87.67 },
      { name:"Room 1",revenue:2714.53,nights:30,occ:97,adr:90.48,revpar:87.57 },
      { name:"Room 3",revenue:2694.71,nights:31,occ:100,adr:86.93,revpar:86.93 },
      { name:"Room 2",revenue:2541.85,nights:30,occ:97,adr:84.73,revpar:82.00 },
      { name:"Room 5",revenue:2541.22,nights:30,occ:97,adr:84.71,revpar:81.97 },
      { name:"Room 6",revenue:2529.86,nights:27,occ:87,adr:93.70,revpar:81.61 },
      { name:"Room 11",revenue:2525.98,nights:31,occ:100,adr:81.48,revpar:81.48 },
      { name:"Room 17",revenue:2424.97,nights:31,occ:100,adr:78.22,revpar:78.22 },
      { name:"Room 12",revenue:2387.62,nights:27,occ:93,adr:88.43,revpar:82.33 },
      { name:"Room 7",revenue:2366.26,nights:28,occ:90,adr:84.51,revpar:76.33 },
      { name:"Bed 1",revenue:1058.76,nights:23,occ:74,adr:46.03,revpar:34.15 },
      { name:"Room 8",revenue:1058.67,nights:25,occ:81,adr:42.35,revpar:34.15 },
      { name:"Room 16",revenue:1031.29,nights:29,occ:94,adr:35.56,revpar:33.27 },
      { name:"Bed 6",revenue:663.83,nights:18,occ:62,adr:36.88,revpar:22.89 },
      { name:"Bed 3",revenue:578.82,nights:18,occ:58,adr:32.16,revpar:18.67 },
      { name:"Bed 5",revenue:481.98,nights:16,occ:52,adr:30.12,revpar:15.55 },
      { name:"Bed 2",revenue:475.77,nights:13,occ:42,adr:36.60,revpar:15.35 },
      { name:"Bed 4",revenue:451.03,nights:13,occ:42,adr:34.69,revpar:14.55 },
    ],
  },
  "Apr 1-4": {
    days: 4,
    summary: { roomRevenue: 8066.18, tax: 1048.60, totalWithTax: 9114.78, reservations: 47, nights: 76, occupancy: 90, adr: 106.13, lead: 25, stay: 2, revpar: 96.03 },
    channels: [
      { name: "Booking.com", revenue: 4760.18, res: 23, canc: 6, nights: 43, adr: 110.70 },
      { name: "Extranet", revenue: 1837.03, res: 13, canc: 2, nights: 19, adr: 96.69 },
      { name: "Simple Booking", revenue: 937.27, res: 7, canc: 1, nights: 8, adr: 117.16 },
      { name: "Expedia", revenue: 460.90, res: 3, canc: 1, nights: 5, adr: 92.18 },
      { name: "Mobile App", revenue: 70.80, res: 1, canc: 0, nights: 1, adr: 70.80 },
    ],
    roomTypes: [
      { name: "Queen Pool View", revenue: 1993.13, res: 12, nights: 20, occ: 100, adr: 99.66, revpar: 99.66 },
      { name: "Triple (3 Single)", revenue: 1394.54, res: 8, nights: 11, occ: 100, adr: 126.78, revpar: 126.78 },
      { name: "King Pool Access", revenue: 1245.53, res: 7, nights: 12, occ: 100, adr: 103.79, revpar: 103.79 },
      { name: "Micro Queen", revenue: 893.70, res: 5, nights: 8, occ: 100, adr: 111.71, revpar: 111.71 },
      { name: "Suite w/ Balcony", revenue: 871.34, res: 6, nights: 8, occ: 100, adr: 108.92, revpar: 108.92 },
      { name: "Micro Twin", revenue: 517.13, res: 4, nights: 5, occ: 63, adr: 103.43, revpar: 64.64 },
      { name: "Twin Pool View", revenue: 411.53, res: 3, nights: 4, occ: 100, adr: 102.88, revpar: 102.88 },
      { name: "Bunk Beds (Dorm)", revenue: 394.14, res: 3, nights: 5, occ: 56, adr: 78.83, revpar: 43.79 },
      { name: "1BR Apartment", revenue: 345.13, res: 2, nights: 3, occ: 75, adr: 115.04, revpar: 86.28 },
    ],
    rooms: [
      { name:"Room 10",revenue:530.64,nights:4,occ:100,adr:132.66,revpar:132.66 },
      { name:"Room 7",revenue:506.51,nights:4,occ:100,adr:126.63,revpar:126.63 },
      { name:"Room 5",revenue:495.17,nights:4,occ:100,adr:123.79,revpar:123.79 },
      { name:"Room 18",revenue:488.90,nights:4,occ:100,adr:122.23,revpar:122.23 },
      { name:"Room 2",revenue:480.95,nights:4,occ:100,adr:120.24,revpar:120.24 },
      { name:"Room 15",revenue:450.86,nights:4,occ:100,adr:112.72,revpar:112.72 },
      { name:"Room 19",revenue:420.48,nights:4,occ:100,adr:105.12,revpar:105.12 },
      { name:"Room 6",revenue:411.53,nights:4,occ:100,adr:102.88,revpar:102.88 },
      { name:"Room 4",revenue:409.32,nights:4,occ:100,adr:102.33,revpar:102.33 },
      { name:"Room 17",revenue:387.19,nights:4,occ:100,adr:96.80,revpar:96.80 },
      { name:"Room 12",revenue:382.32,nights:4,occ:100,adr:95.58,revpar:95.58 },
      { name:"Room 14",revenue:382.26,nights:4,occ:100,adr:95.57,revpar:95.57 },
      { name:"Bed 1",revenue:378.00,nights:4,occ:100,adr:94.50,revpar:94.50 },
      { name:"Room 13",revenue:375.00,nights:3,occ:100,adr:125.00,revpar:125.00 },
      { name:"Room 11",revenue:372.86,nights:4,occ:100,adr:93.21,revpar:93.21 },
      { name:"Room 9",revenue:372.00,nights:4,occ:100,adr:93.00,revpar:93.00 },
      { name:"Room 1",revenue:345.13,nights:3,occ:75,adr:115.04,revpar:86.28 },
      { name:"Room 3",revenue:343.79,nights:4,occ:100,adr:85.95,revpar:85.95 },
      { name:"Room 16",revenue:260.47,nights:3,occ:75,adr:86.82,revpar:65.12 },
      { name:"Room 8",revenue:256.66,nights:2,occ:50,adr:128.33,revpar:64.17 },
      { name:"Bed 5",revenue:16.14,nights:1,occ:100,adr:16.14,revpar:16.14 },
    ],
  },
};

const MKEYS = Object.keys(DATA);
function dlt(cur, prev) { return prev && prev !== 0 ? ((cur - prev) / Math.abs(prev) * 100) : null; }

function Dlt({ val, inv }) {
  if (val == null) return null;
  const pos = inv ? val < 0 : val > 0;
  const color = Math.abs(val) < 1 ? C.muted : pos ? C.positive : C.negative;
  return <span style={{ fontSize: 11, fontWeight: 600, color, marginLeft: 4 }}>{val > 0 ? "▲" : "▼"} {Math.abs(val).toFixed(1)}%</span>;
}

function KPI({ icon, label, value, sub, accent = C.terracotta, d }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: "16px 18px", borderLeft: `4px solid ${accent}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>{icon} {label}</div>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: C.darkWine, lineHeight: 1.1 }}>{value}</span>{d}
      </div>
      {sub && <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>}
    </div>
  );
}

function Sec({ children }) {
  return <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.darkWine, margin: "24px 0 12px", paddingBottom: 6, borderBottom: `2px solid ${C.border}` }}>{children}</h2>;
}

function OccBar({ label, value, prev }) {
  const color = value >= 90 ? C.positive : value >= 75 ? C.terracotta : C.warning;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ fontWeight: 600, color: C.darkWine }}>{label}</span>
        <span><b style={{ color }}>{value}%</b><Dlt val={dlt(value, prev)} /></span>
      </div>
      <div style={{ height: 9, background: C.blush, borderRadius: 5, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(value, 100)}%`, height: "100%", background: color, borderRadius: 5 }} />
      </div>
    </div>
  );
}

const TH = ({ children, left }) => <th style={{ padding: "8px 10px", textAlign: left ? "left" : "right", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{children}</th>;
const TD = ({ children, bold, color, left }) => <td style={{ padding: "8px 10px", textAlign: left ? "left" : "right", fontWeight: bold ? 600 : 400, color: color || C.darkWine }}>{children}</td>;

const CTip = ({ active, payload, label, f }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <div style={{ fontWeight: 600, marginBottom: 3, color: C.darkWine }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: {f ? f(p.value) : p.value}</div>)}
    </div>
  );
};

const TABS = ["Overview", "Channels", "Room Types", "Rooms"];

export default function Dashboard() {
  const [month, setMonth] = useState("Mar 2026");
  const [tab, setTab] = useState("Overview");
  const d = DATA[month];
  const pi = MKEYS.indexOf(month);
  const prev = pi > 0 ? DATA[MKEYS[pi - 1]] : null;
  const s = d.summary;
  const ps = prev?.summary;

  const directRev = d.channels.filter(c => DIRECT_CH.includes(c.name)).reduce((a, c) => a + c.revenue, 0);
  const otaRev = s.roomRevenue - directRev;
  const directPct = (directRev / s.roomRevenue * 100).toFixed(1);

  const privRooms = d.rooms.filter(r => r.name.startsWith("Room"));
  const dorms = d.rooms.filter(r => r.name.startsWith("Bed"));
  const privOcc = +(privRooms.reduce((a, r) => a + r.nights, 0) / (19 * d.days) * 100).toFixed(1);
  const dormOcc = dorms.length ? +(dorms.reduce((a, r) => a + r.nights, 0) / (6 * d.days) * 100).toFixed(1) : 0;
  const prevPrivOcc = prev ? +(prev.rooms.filter(r => r.name.startsWith("Room")).reduce((a, r) => a + r.nights, 0) / (19 * prev.days) * 100).toFixed(1) : null;
  const prevDormOcc = prev ? +(prev.rooms.filter(r => r.name.startsWith("Bed")).reduce((a, r) => a + r.nights, 0) / (6 * prev.days) * 100).toFixed(1) : null;

  const trend = MKEYS.map(k => {
    const m = DATA[k];
    const dr = m.channels.filter(c => DIRECT_CH.includes(c.name)).reduce((a, c) => a + c.revenue, 0);
    return { month: k.replace(" 2026", ""), revenue: m.summary.totalWithTax, roomRev: m.summary.roomRevenue, occ: m.summary.occupancy, adr: m.summary.adr, revpar: m.summary.revpar, directPct: +(dr / m.summary.roomRevenue * 100).toFixed(1) };
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.cream, minHeight: "100vh", color: C.darkWine }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {/* Header */}
      <div style={{ background: C.darkWine, padding: "22px 24px 16px", color: C.cream }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, letterSpacing: 1.5 }}>HOTEL YULI</div>
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>Monthly Statistics Dashboard — 2026</div>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {MKEYS.map(m => (
              <button key={m} onClick={() => setMonth(m)} style={{
                padding: "7px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: month === m ? C.terracotta : "transparent",
                color: month === m ? C.white : "rgba(250,248,245,0.5)", transition: "all 0.2s",
              }}>{m.replace(" 2026", "")}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 14, flexWrap: "wrap" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
              background: tab === t ? "rgba(250,248,245,0.15)" : "transparent",
              color: tab === t ? C.cream : "rgba(250,248,245,0.45)",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 24px 40px", maxWidth: 1200, margin: "0 auto" }}>
        {tab === "Overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 10, marginTop: 4 }}>
              <KPI icon="💰" label="Revenue (incl. tax)" value={fmt(s.totalWithTax)} accent={C.darkWine} d={ps && <Dlt val={dlt(s.totalWithTax, ps.totalWithTax)} />} />
              <KPI icon="🏨" label="Room Revenue" value={fmt(s.roomRevenue)} d={ps && <Dlt val={dlt(s.roomRevenue, ps.roomRevenue)} />} />
              <KPI icon="📊" label="Occupancy" value={s.occupancy + "%"} sub={`${fmtInt(s.nights)} nights`} accent={C.positive} d={ps && <Dlt val={dlt(s.occupancy, ps.occupancy)} />} />
              <KPI icon="📈" label="ADR" value={fmt(s.adr)} d={ps && <Dlt val={dlt(s.adr, ps.adr)} />} />
              <KPI icon="💎" label="RevPAR" value={fmt(s.revpar)} d={ps && <Dlt val={dlt(s.revpar, ps.revpar)} />} />
              <KPI icon="📋" label="Reservations" value={fmtInt(s.reservations)} sub={`Lead: ${s.lead}d`} accent={C.muted} d={ps && <Dlt val={dlt(s.reservations, ps.reservations)} />} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 4 }}>
              <div>
                <Sec>Revenue Trend</Sec>
                <div style={{ background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.blush} />
                      <XAxis dataKey="month" style={{ fontSize: 11 }} />
                      <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} style={{ fontSize: 10 }} />
                      <Tooltip content={<CTip f={fmt} />} />
                      <Bar dataKey="revenue" name="Total (w/ tax)" fill={C.darkWine} radius={[5,5,0,0]} barSize={28} />
                      <Bar dataKey="roomRev" name="Room Rev." fill={C.terracotta} radius={[5,5,0,0]} barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <Sec>KPI Trend</Sec>
                <div style={{ background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.blush} />
                      <XAxis dataKey="month" style={{ fontSize: 11 }} />
                      <YAxis style={{ fontSize: 10 }} />
                      <Tooltip content={<CTip f={v => typeof v === "number" && v < 200 ? (v % 1 === 0 ? v + "%" : "$" + v.toFixed(2)) : v} />} />
                      <Line type="monotone" dataKey="occ" name="Occupancy %" stroke={C.positive} strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="adr" name="ADR" stroke={C.darkWine} strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="revpar" name="RevPAR" stroke={C.terracotta} strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 4 }}>
              <div>
                <Sec>Direct vs OTA</Sec>
                <div style={{ background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={[{ name: "Direct", value: directRev }, { name: "OTA", value: otaRev }]} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} style={{ fontSize: 11 }}>
                        <Cell fill={C.positive} /><Cell fill={C.terracotta} />
                      </Pie>
                      <Tooltip formatter={v => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ textAlign: "center", fontSize: 11, color: C.muted }}>Direct: <b style={{ color: C.positive }}>{directPct}%</b></div>
                </div>
              </div>
              <div>
                <Sec>Occupancy Breakdown</Sec>
                <div style={{ background: C.white, borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <OccBar label="Overall" value={s.occupancy} prev={ps?.occupancy} />
                  <OccBar label="Private Rooms (19)" value={privOcc} prev={prevPrivOcc} />
                  <OccBar label="Dorm Beds (6)" value={dormOcc} prev={prevDormOcc} />
                </div>
              </div>
            </div>

            <Sec>YTD Summary (Jan–{month.replace(" 2026", "")})</Sec>
            <div style={{ background: C.white, borderRadius: 12, overflow: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ background: C.darkWine, color: C.cream }}>
                  <TH left>Month</TH><TH>Rev+Tax</TH><TH>Room Rev</TH><TH>Nights</TH><TH>Occ%</TH><TH>ADR</TH><TH>RevPAR</TH><TH>Res.</TH><TH>Direct%</TH>
                </tr></thead>
                <tbody>
                  {MKEYS.slice(0, pi + 1).map((k, i) => {
                    const m = DATA[k]; const dr = m.channels.filter(c => DIRECT_CH.includes(c.name)).reduce((a, c) => a + c.revenue, 0);
                    return (
                      <tr key={k} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : C.blush }}>
                        <TD left bold>{k.replace(" 2026","")}</TD><TD>{fmt(m.summary.totalWithTax)}</TD><TD>{fmt(m.summary.roomRevenue)}</TD>
                        <TD>{m.summary.nights}</TD><TD bold color={m.summary.occupancy >= 90 ? C.positive : C.darkWine}>{m.summary.occupancy}%</TD>
                        <TD>{fmt(m.summary.adr)}</TD><TD bold>{fmt(m.summary.revpar)}</TD><TD>{m.summary.reservations}</TD>
                        <TD>{(dr / m.summary.roomRevenue * 100).toFixed(1)}%</TD>
                      </tr>
                    );
                  })}
                  {pi >= 1 && (() => {
                    const months = MKEYS.slice(0, pi + 1);
                    const totRev = months.reduce((a, k) => a + DATA[k].summary.totalWithTax, 0);
                    const totRoom = months.reduce((a, k) => a + DATA[k].summary.roomRevenue, 0);
                    const totNights = months.reduce((a, k) => a + DATA[k].summary.nights, 0);
                    const totDays = months.reduce((a, k) => a + DATA[k].days, 0);
                    const totRes = months.reduce((a, k) => a + DATA[k].summary.reservations, 0);
                    const totDirect = months.reduce((a, k) => a + DATA[k].channels.filter(c => DIRECT_CH.includes(c.name)).reduce((a2, c) => a2 + c.revenue, 0), 0);
                    return (
                      <tr style={{ background: C.blush, borderTop: `2px solid ${C.darkWine}` }}>
                        <TD left bold>YTD</TD><TD bold>{fmt(totRev)}</TD><TD bold>{fmt(totRoom)}</TD>
                        <TD bold>{totNights}</TD><TD bold>{(totNights / (25 * totDays) * 100).toFixed(0)}%</TD>
                        <TD bold>{fmt(totRoom / totNights)}</TD><TD bold>{fmt(totRoom / (25 * totDays))}</TD>
                        <TD bold>{totRes}</TD><TD bold>{(totDirect / totRoom * 100).toFixed(1)}%</TD>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "Channels" && (
          <>
            <Sec>Revenue by Channel</Sec>
            <div style={{ background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <ResponsiveContainer width="100%" height={Math.max(200, d.channels.length * 36)}>
                <BarChart data={[...d.channels].sort((a, b) => b.revenue - a.revenue)} layout="vertical" margin={{ left: 110, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.blush} horizontal={false} />
                  <XAxis type="number" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} style={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" style={{ fontSize: 11 }} width={100} />
                  <Tooltip content={<CTip f={fmt} />} />
                  <Bar dataKey="revenue" fill={C.darkWine} radius={[0,6,6,0]} barSize={18} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Sec>Channel Detail</Sec>
            <div style={{ background: C.white, borderRadius: 12, overflow: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ background: C.darkWine, color: C.cream }}>
                  <TH left>Channel</TH><TH>Revenue</TH><TH>MoM</TH><TH>Share</TH><TH>Type</TH><TH>Res.</TH><TH>Canc.</TH><TH>Nights</TH><TH>ADR</TH>
                </tr></thead>
                <tbody>
                  {[...d.channels].sort((a, b) => b.revenue - a.revenue).map((c, i) => {
                    const pc = prev?.channels.find(x => x.name === c.name);
                    const isDirect = DIRECT_CH.includes(c.name);
                    return (
                      <tr key={c.name} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : C.blush }}>
                        <TD left bold>{c.name}</TD><TD>{fmt(c.revenue)}</TD>
                        <TD><Dlt val={dlt(c.revenue, pc?.revenue)} /></TD>
                        <TD>{((c.revenue / s.roomRevenue) * 100).toFixed(1)}%</TD>
                        <TD><span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: isDirect ? "#e8f5e9" : "#fff3e0", color: isDirect ? C.positive : "#e65100", fontWeight: 600 }}>{isDirect ? "DIRECT" : "OTA"}</span></TD>
                        <TD>{c.res}</TD><TD color={c.canc > 5 ? C.negative : C.darkWine}>{c.canc}</TD>
                        <TD>{c.nights}</TD><TD>{fmt(c.adr)}</TD>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Sec>Channel Trend</Sec>
            <div style={{ background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={MKEYS.map(k => {
                  const obj = { month: k.replace(" 2026", "") };
                  DATA[k].channels.forEach(c => { obj[c.name] = c.revenue; });
                  return obj;
                })} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.blush} />
                  <XAxis dataKey="month" style={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} style={{ fontSize: 10 }} />
                  <Tooltip content={<CTip f={fmt} />} />
                  <Line type="monotone" dataKey="Extranet" stroke={C.positive} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Booking.com" stroke={C.darkWine} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Expedia" stroke={C.terracotta} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Simple Booking" stroke={C.warning} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {tab === "Room Types" && (
          <>
            <Sec>Revenue by Room Category</Sec>
            <div style={{ background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[...d.roomTypes].sort((a, b) => b.revenue - a.revenue)} layout="vertical" margin={{ left: 125, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.blush} horizontal={false} />
                  <XAxis type="number" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} style={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" style={{ fontSize: 10 }} width={115} />
                  <Tooltip content={<CTip f={fmt} />} />
                  <Bar dataKey="revenue" fill={C.terracotta} radius={[0,6,6,0]} barSize={18} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Sec>Occupancy by Category</Sec>
            <div style={{ background: C.white, borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              {[...d.roomTypes].sort((a, b) => b.occ - a.occ).map(rt => {
                const prt = prev?.roomTypes.find(x => x.name === rt.name);
                return <OccBar key={rt.name} label={rt.name} value={Math.min(rt.occ, 100)} prev={prt?.occ} />;
              })}
            </div>
            <Sec>Room Category Table</Sec>
            <div style={{ background: C.white, borderRadius: 12, overflow: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ background: C.darkWine, color: C.cream }}>
                  <TH left>Type</TH><TH>Revenue</TH><TH>MoM</TH><TH>Nights</TH><TH>Occ%</TH><TH>ADR</TH><TH>RevPAR</TH>
                </tr></thead>
                <tbody>
                  {[...d.roomTypes].sort((a, b) => b.revenue - a.revenue).map((rt, i) => {
                    const prt = prev?.roomTypes.find(x => x.name === rt.name);
                    return (
                      <tr key={rt.name} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : C.blush }}>
                        <TD left bold>{rt.name}</TD><TD>{fmt(rt.revenue)}</TD>
                        <TD><Dlt val={dlt(rt.revenue, prt?.revenue)} /></TD>
                        <TD>{rt.nights}</TD>
                        <TD bold color={rt.occ >= 95 ? C.positive : rt.occ >= 80 ? C.darkWine : C.warning}>{rt.occ}%</TD>
                        <TD>{fmt(rt.adr)}</TD><TD bold>{fmt(rt.revpar)}</TD>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "Rooms" && <RoomsTab rooms={d.rooms} prevRooms={prev?.rooms} />}
      </div>
      <div style={{ textAlign: "center", padding: "12px", color: C.muted, fontSize: 10, borderTop: `1px solid ${C.border}` }}>Hotel Yuli · Uvita, Costa Rica · Pick Your Destination S.R.L.</div>
    </div>
  );
}

function RoomsTab({ rooms, prevRooms }) {
  const [sortBy, setSortBy] = useState("revenue");
  const [showDorm, setShowDorm] = useState(true);
  const filtered = showDorm ? rooms : rooms.filter(r => r.name.startsWith("Room"));
  const sorted = [...filtered].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
        {["revenue","occ","adr","revpar"].map(s => (
          <button key={s} onClick={() => setSortBy(s)} style={{ padding: "5px 11px", borderRadius: 6, border: `1px solid ${sortBy === s ? C.darkWine : C.border}`, background: sortBy === s ? C.darkWine : C.white, color: sortBy === s ? C.cream : C.darkWine, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{s.toUpperCase()}</button>
        ))}
        <label style={{ marginLeft: 10, fontSize: 11, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <input type="checkbox" checked={showDorm} onChange={() => setShowDorm(!showDorm)} style={{ accentColor: C.darkWine }} /> Dorms
        </label>
      </div>
      <Sec>Room Performance</Sec>
      <div style={{ background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <ResponsiveContainer width="100%" height={Math.max(350, sorted.length * 24)}>
          <BarChart data={sorted} layout="vertical" margin={{ left: 70, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.blush} horizontal={false} />
            <XAxis type="number" tickFormatter={v => sortBy === "occ" ? `${v}%` : sortBy === "revenue" ? `$${(v/1000).toFixed(1)}k` : `$${v.toFixed(0)}`} style={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" style={{ fontSize: 10 }} width={60} />
            <Tooltip content={<CTip f={v => sortBy === "occ" ? `${v}%` : fmt(v)} />} />
            <Bar dataKey={sortBy} radius={[0,6,6,0]} barSize={15} name={sortBy.toUpperCase()}>
              {sorted.map(r => <Cell key={r.name} fill={r.name.startsWith("Bed") ? C.muted : (sortBy === "occ" && r.occ < 80 ? C.warning : C.darkWine)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Sec>Room Table</Sec>
      <div style={{ background: C.white, borderRadius: 12, overflow: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: C.darkWine, color: C.cream }}>
            <TH left>Room</TH><TH>Revenue</TH><TH>MoM</TH><TH>Nights</TH><TH>Occ%</TH><TH>ADR</TH><TH>RevPAR</TH>
          </tr></thead>
          <tbody>
            {sorted.map((r, i) => {
              const pr = prevRooms?.find(x => x.name === r.name);
              return (
                <tr key={r.name} style={{ borderBottom: `1px solid ${C.border}`, background: r.name.startsWith("Bed") ? C.blush : (i % 2 === 0 ? C.white : C.cream) }}>
                  <TD left bold color={r.name.startsWith("Bed") ? C.muted : C.darkWine}>{r.name}</TD>
                  <TD>{fmt(r.revenue)}</TD><TD><Dlt val={dlt(r.revenue, pr?.revenue)} /></TD>
                  <TD>{r.nights}</TD>
                  <TD bold color={r.occ >= 95 ? C.positive : r.occ >= 80 ? C.darkWine : C.warning}>{r.occ}%</TD>
                  <TD>{fmt(r.adr)}</TD><TD bold>{fmt(r.revpar)}</TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
