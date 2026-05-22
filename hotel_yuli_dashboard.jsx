import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const C = { darkWine:"#4D333E", terracotta:"#C97B77", cream:"#FAF8F5", blush:"#F0EAE4", white:"#FFFFFF", muted:"#8A7A72", positive:"#2D7A4F", negative:"#C4312D", warning:"#E8A838", border:"#E8E0D8", accent2:"#4A6FA5" };
const fmt = n => "$" + n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtK = n => "$" + (n/1000).toFixed(1) + "k";
const DIRECT_CH = ["Extranet","Simple Booking","Mobile App","Direct Booking"];

// ─── BOOKINGS ANALYTICS DATA (from reservations CSVs) ───
const BOOKINGS_2025 = {
  total: 2915, agency: 122, total_nights: 5309, avg_stay: 1.82,
  monthly: [
    {month:"Jan",bookings:311,agency:10,avg_stay:1.98,revenue:50249.97,nights:616},
    {month:"Feb",bookings:307,agency:28,avg_stay:1.94,revenue:52097.05,nights:595},
    {month:"Mar",bookings:328,agency:13,avg_stay:1.84,revenue:50905.55,nights:605},
    {month:"Apr",bookings:303,agency:10,avg_stay:1.73,revenue:42120.94,nights:524},
    {month:"May",bookings:205,agency:2, avg_stay:1.92,revenue:23232.87,nights:394},
    {month:"Jun",bookings:158,agency:4, avg_stay:1.68,revenue:15735.07,nights:266},
    {month:"Jul",bookings:220,agency:10,avg_stay:1.71,revenue:24570.91,nights:377},
    {month:"Aug",bookings:264,agency:21,avg_stay:1.72,revenue:37723.18,nights:454},
    {month:"Sep",bookings:253,agency:4, avg_stay:1.85,revenue:27285.88,nights:469},
    {month:"Oct",bookings:105,agency:2, avg_stay:1.61,revenue:11264.51,nights:169},
    {month:"Nov",bookings:220,agency:9, avg_stay:1.83,revenue:31595.01,nights:402},
    {month:"Dec",bookings:241,agency:9, avg_stay:1.82,revenue:49402.97,nights:438},
  ],
  channels_bookings: [
    {name:"Booking.com",bookings:1516,pct:52.0},
    {name:"Extranet (Direct)",bookings:932,pct:32.0},
    {name:"Simple Booking",bookings:143,pct:4.9},
    {name:"Mobile App",bookings:121,pct:4.2},
    {name:"Expedia",bookings:114,pct:3.9},
    {name:"Hostelworld",bookings:78,pct:2.7},
    {name:"Direct Booking",bookings:10,pct:0.3},
    {name:"Airbnb",bookings:1,pct:0.0},
  ],
  countries: [
    {country:"Costa Rica",bookings:362},{country:"Germany",bookings:271},{country:"Netherlands",bookings:143},
    {country:"France",bookings:141},{country:"Spain",bookings:138},{country:"Switzerland",bookings:81},
    {country:"United Kingdom",bookings:77},{country:"United States",bookings:64},{country:"Belgium",bookings:40},{country:"Canada",bookings:38},
  ],
  agencies: [
    {name:"Que Buen Ride",bookings:42},{name:"Ecole Travel",bookings:25},{name:"Witropa",bookings:11},
    {name:"Amadeus",bookings:8},{name:"CR Découverte",bookings:6},{name:"Terra Caribea",bookings:6},
    {name:"Napurula",bookings:6},{name:"CAST CR",bookings:5},{name:"Others",bookings:13},
  ],
  stay_dist:[
    {nights:"1n",count:1462,pct:50.2},{nights:"2n",count:859,pct:29.5},{nights:"3n",count:410,pct:14.1},
    {nights:"4n",count:116,pct:4.0},{nights:"5n+",count:66,pct:2.3},
  ],
};
const BOOKINGS_Q1_2026 = {
  total:958, agency:112, total_nights:1930, avg_stay:2.01,
  monthly:[
    {month:"Jan",bookings:319,agency:40,avg_stay:1.89,nights:603},
    {month:"Feb",bookings:303,agency:34,avg_stay:2.17,nights:659},
    {month:"Mar",bookings:336,agency:38,avg_stay:1.99,nights:668},
  ],
  channels_bookings:[
    {name:"Booking.com",bookings:442,pct:46.1},
    {name:"Extranet (Direct)",bookings:332,pct:34.7},
    {name:"Expedia",bookings:63,pct:6.6},
    {name:"Simple Booking",bookings:47,pct:4.9},
    {name:"Mobile App",bookings:38,pct:4.0},
    {name:"Hostelworld",bookings:31,pct:3.2},
    {name:"Direct Booking",bookings:3,pct:0.3},
    {name:"Airbnb",bookings:2,pct:0.2},
  ],
  countries:[
    {country:"Germany",bookings:85},{country:"Costa Rica",bookings:73},{country:"Netherlands",bookings:44},
    {country:"France",bookings:42},{country:"United Kingdom",bookings:34},{country:"Switzerland",bookings:31},
    {country:"United States",bookings:31},{country:"Spain",bookings:31},{country:"Canada",bookings:15},{country:"Denmark",bookings:11},
  ],
  agencies:[
    {name:"Witropa",bookings:31},{name:"Que Buen Ride",bookings:24},{name:"Ecole Travel",bookings:13},
    {name:"CR Découverte",bookings:9},{name:"Amadeus",bookings:8},{name:"CR Wildlife",bookings:4},
    {name:"CRS Tours",bookings:4},{name:"Others",bookings:19},
  ],
  stay_dist:[
    {nights:"1n",count:430,pct:44.9},{nights:"2n",count:267,pct:27.9},{nights:"3n",count:165,pct:17.2},
    {nights:"4n",count:57,pct:5.9},{nights:"5n+",count:39,pct:4.1},
  ],
};

// ─── 2025 ANNUAL DATA ───
const Y2025 = {
  summary:{ roomRevenue:369450.34, tax:47755.20, totalWithTax:417205.54, reservations:2922, nights:6001, occupancy:72, adr:61.56, lead:18, stay:2, revpar:44.59, cancellations:500 },
  channels:[
    {name:"Direct",revenue:112399.72+22002.84+14771.69+1394.00,res:933+144+121+10,canc:150+19+24+2,nights:1809+308+241+18,adr:0,isDirect:true},
    {name:"Booking.com",revenue:195379.94,res:1521,canc:270,nights:3154,adr:61.95,isDirect:false},
    {name:"Expedia",revenue:16383.56,res:114,canc:17,nights:222,adr:73.80,isDirect:false},
    {name:"Hostelworld Group",revenue:7031.17,res:78,canc:18,nights:247,adr:28.47,isDirect:false},
    {name:"Airbnb",revenue:87.42,res:1,canc:0,nights:2,adr:43.71,isDirect:false},
  ],
  roomTypes:[
    {name:"Queen Pool View",revenue:96864.95,res:742,nights:1401,occ:82,adr:69.14,revpar:56.65},
    {name:"Triple (3 Single)",revenue:61560.60,res:398,nights:757,occ:77,adr:81.32,revpar:62.88},
    {name:"King Pool Access",revenue:55367.68,res:396,nights:763,occ:76,adr:72.57,revpar:55.42},
    {name:"Suite w/ Balcony",revenue:45320.30,res:303,nights:585,occ:86,adr:77.47,revpar:66.75},
    {name:"Micro Queen",revenue:33524.82,res:322,nights:563,occ:84,adr:59.55,revpar:49.81},
    {name:"Bunk Beds (Dorm)",revenue:21817.87,res:449,nights:1004,occ:53,adr:21.73,revpar:11.43},
    {name:"Micro Twin",revenue:20009.80,res:247,nights:433,occ:63,adr:46.21,revpar:29.30},
    {name:"1BR Apartment",revenue:17774.70,res:103,nights:220,occ:72,adr:80.79,revpar:58.28},
    {name:"Twin Pool View",revenue:17209.63,res:136,nights:275,occ:79,adr:62.58,revpar:49.31},
  ],
  rooms:[
    {name:"Room 15",revenue:23349.40,nights:304,occ:89,adr:76.81,revpar:68.47},
    {name:"Room 10",revenue:22103.91,nights:272,occ:77,adr:81.26,revpar:62.97},
    {name:"Room 19",revenue:21733.78,nights:278,occ:82,adr:78.18,revpar:64.30},
    {name:"Room 18",revenue:21568.41,nights:270,occ:81,adr:79.88,revpar:64.77},
    {name:"Room 14",revenue:20998.24,nights:284,occ:82,adr:73.94,revpar:60.69},
    {name:"Room 11",revenue:20898.86,nights:298,occ:85,adr:70.13,revpar:59.71},
    {name:"Room 5",revenue:20167.10,nights:294,occ:86,adr:68.60,revpar:59.32},
    {name:"Room 9",revenue:19883.68,nights:284,occ:82,adr:70.01,revpar:57.63},
    {name:"Room 4",revenue:19371.40,nights:283,occ:85,adr:68.45,revpar:58.52},
    {name:"Room 17",revenue:17821.06,nights:294,occ:90,adr:60.62,revpar:54.33},
    {name:"Room 1",revenue:17774.70,nights:220,occ:72,adr:80.79,revpar:58.28},
    {name:"Room 13",revenue:17672.53,nights:211,occ:72,adr:83.76,revpar:59.91},
    {name:"Room 12",revenue:16920.11,nights:232,occ:69,adr:72.93,revpar:50.06},
    {name:"Room 2",revenue:16810.40,nights:238,occ:76,adr:70.63,revpar:53.37},
    {name:"Room 6",revenue:16724.46,nights:269,occ:77,adr:62.17,revpar:47.92},
    {name:"Room 3",revenue:16543.90,nights:242,occ:70,adr:68.36,revpar:48.09},
    {name:"Room 7",revenue:15703.76,nights:269,occ:78,adr:58.38,revpar:45.52},
    {name:"Room 16",revenue:10928.46,nights:238,occ:69,adr:45.92,revpar:31.86},
    {name:"Room 8",revenue:9031.41,nights:194,occ:57,adr:46.55,revpar:26.56},
    {name:"Bed 1",revenue:5161.57,nights:238,occ:74,adr:21.69,revpar:15.98},
    {name:"Bed 3",revenue:3665.68,nights:174,occ:55,adr:21.07,revpar:11.64},
    {name:"Bed 2",revenue:3648.72,nights:180,occ:56,adr:20.27,revpar:11.44},
    {name:"Bed 5",revenue:3319.97,nights:155,occ:49,adr:21.42,revpar:10.54},
    {name:"Bed 6",revenue:3006.71,nights:113,occ:35,adr:26.61,revpar:9.40},
    {name:"Bed 4",revenue:2994.16,nights:143,occ:45,adr:20.94,revpar:9.48},
  ],
};

// ─── 2026 YTD (Jan–Apr) ───
const Y2026 = {
  days: 120, // Jan31+Feb28+Mar31+Apr30
  summary:{ roomRevenue:200705.92, tax:26061.03, totalWithTax:226766.95, reservations:1092, nights:2557, occupancy:88, adr:78.49, lead:27, stay:2, revpar:67.28, cancellations:196 },
  channels:[
    {name:"Direct",revenue:69886.69+13721.33+11229.74+582.00,res:414+63+40+2,canc:52+4+5+1,nights:957+173+154+6,adr:0,isDirect:true},
    {name:"Booking.com",revenue:79142.20,res:482,canc:95,nights:1067,adr:73.99,isDirect:false},
    {name:"Expedia",revenue:12614.14,res:68,canc:23,nights:143,adr:88.21,isDirect:false},
    {name:"Hostelworld Group",revenue:3755.84,res:34,canc:5,nights:106,adr:35.43,isDirect:false},
    {name:"Airbnb",revenue:177.60,res:1,canc:1,nights:2,adr:88.80,isDirect:false},
  ],
  roomTypes:[
    {name:"Queen Pool View",revenue:50818.12,res:258,nights:565,occ:96,adr:89.94,revpar:86.12},
    {name:"Triple (3 Single)",revenue:35097.98,res:157,nights:335,occ:94,adr:104.77,revpar:98.47},
    {name:"King Pool Access",revenue:31164.62,res:158,nights:338,occ:96,adr:92.20,revpar:88.37},
    {name:"Suite w/ Balcony",revenue:22808.01,res:111,nights:230,occ:96,adr:99.16,revpar:95.47},
    {name:"Micro Queen",revenue:18325.38,res:128,nights:233,occ:96,adr:78.65,revpar:75.49},
    {name:"Bunk Beds (Dorm)",revenue:14729.67,res:195,nights:477,occ:69,adr:30.88,revpar:21.23},
    {name:"1BR Apartment",revenue:10465.95,res:57,nights:114,occ:95,adr:91.81,revpar:87.16},
    {name:"Twin Pool View",revenue:9499.84,res:61,nights:111,occ:92,adr:85.58,revpar:78.74},
    {name:"Micro Twin",revenue:8785.95,res:86,nights:166,occ:83,adr:52.93,revpar:43.93},
  ],
  rooms:[
    {name:"Room 10",revenue:12423.55,nights:118,occ:98,adr:105.28,revpar:103.53},
    {name:"Room 18",revenue:11953.82,nights:112,occ:93,adr:106.73,revpar:99.61},
    {name:"Room 15",revenue:11493.08,nights:115,occ:96,adr:99.94,revpar:95.77},
    {name:"Room 19",revenue:11576.79,nights:113,occ:94,adr:102.45,revpar:96.47},
    {name:"Room 4",revenue:11176.64,nights:114,occ:95,adr:98.04,revpar:93.14},
    {name:"Room 14",revenue:11043.23,nights:118,occ:98,adr:93.59,revpar:92.03},
    {name:"Room 13",revenue:10472.68,nights:102,occ:85,adr:102.67,revpar:87.27},
    {name:"Room 2",revenue:10188.54,nights:118,occ:98,adr:86.34,revpar:84.90},
    {name:"Room 3",revenue:10345.97,nights:117,occ:97,adr:88.42,revpar:86.22},
    {name:"Room 11",revenue:9870.69,nights:113,occ:94,adr:87.35,revpar:82.25},
    {name:"Room 9",revenue:9873.42,nights:109,occ:91,adr:90.58,revpar:82.28},
    {name:"Room 5",revenue:9978.72,nights:116,occ:97,adr:86.02,revpar:83.16},
    {name:"Room 6",revenue:9381.24,nights:107,occ:89,adr:87.67,revpar:78.18},
    {name:"Room 12",revenue:8942.94,nights:103,occ:86,adr:86.83,revpar:74.52},
    {name:"Room 17",revenue:9335.91,nights:114,occ:95,adr:81.90,revpar:77.80},
    {name:"Room 1",revenue:10041.17,nights:101,occ:84,adr:99.42,revpar:83.68},
    {name:"Room 7",revenue:8793.20,nights:107,occ:89,adr:82.18,revpar:73.28},
    {name:"Room 8",revenue:3960.09,nights:70,occ:58,adr:56.57,revpar:33.00},
    {name:"Room 16",revenue:4773.32,nights:99,occ:82,adr:48.21,revpar:39.78},
    {name:"Bed 1",revenue:2784.22,nights:84,occ:70,adr:33.15,revpar:23.20},
    {name:"Bed 2",revenue:2257.06,nights:71,occ:59,adr:31.79,revpar:18.81},
    {name:"Bed 3",revenue:2296.02,nights:74,occ:62,adr:31.03,revpar:19.13},
    {name:"Bed 4",revenue:2034.60,nights:65,occ:54,adr:31.30,revpar:16.96},
    {name:"Bed 5",revenue:2399.29,nights:76,occ:63,adr:31.57,revpar:19.99},
    {name:"Bed 6",revenue:2150.46,nights:68,occ:57,adr:31.62,revpar:17.92},
  ],
};

function dlt(cur,prev){return prev&&prev!==0?((cur-prev)/Math.abs(prev)*100):null;}
function Dlt({val,inv}){if(val==null)return null;const pos=inv?val<0:val>0;const color=Math.abs(val)<1?C.muted:pos?C.positive:C.negative;return <span style={{fontSize:11,fontWeight:600,color,marginLeft:4}}>{val>0?"▲":"▼"} {Math.abs(val).toFixed(1)}%</span>;}
const fmt2=(v,type)=>type==="pct"?v+"%":type==="int"?v.toLocaleString():fmt(v);
function Sec({children}){return <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.darkWine,margin:"24px 0 12px",paddingBottom:6,borderBottom:`2px solid ${C.border}`}}>{children}</h2>;}
const TH=({children,left})=><th style={{padding:"8px 10px",textAlign:left?"left":"right",fontWeight:600,fontSize:10,textTransform:"uppercase",letterSpacing:0.5}}>{children}</th>;
const TD=({children,bold,color,left,small})=><td style={{padding:"8px 10px",textAlign:left?"left":"right",fontWeight:bold?700:400,color:color||C.darkWine,fontSize:small?11:12}}>{children}</td>;
const CTip=({active,payload,label,f})=>{if(!active||!payload?.length)return null;return(<div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:12,boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}><div style={{fontWeight:600,marginBottom:3,color:C.darkWine}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color}}>{p.name}: {f?f(p.value):p.value}</div>)}</div>);};

// 2026 annualized for fair comparison (×365/120)
const ANNUALIZE = 365/120;
const S26 = Y2026.summary;
const S25 = Y2025.summary;

// Annualized 2026 projections
const proj26 = {
  roomRevenue: S26.roomRevenue * ANNUALIZE,
  totalWithTax: S26.totalWithTax * ANNUALIZE,
  nights: Math.round(S26.nights * ANNUALIZE),
  reservations: Math.round(S26.reservations * ANNUALIZE),
  cancellations: Math.round(S26.cancellations * ANNUALIZE),
};

const TABS = ["Year vs Year","Monthly 2026","Bookings 2025","Bookings Q1 2026","Channels","Room Types","Rooms"];

// ─── MONTHLY 2026 DATA ───
const MONTHLY2026 = {
  Jan:{label:"January",days:31,roomRevenue:54154.94,tax:7025,totalWithTax:61179.94,reservations:270,nights:676,occupancy:89,adr:80.11,revpar:71.63,canc:56,
    directRev:23372.41+3684.45+2775.36,
    channels:[
      {name:"Direct Bookings",r:23372.41+3684.45+2775.36,isDirect:true},
      {name:"Booking.com",r:18939.17,isDirect:false},
      {name:"Expedia",r:3626.29,isDirect:false},
      {name:"Hostelworld",r:1579.66,isDirect:false},
      {name:"Airbnb",r:177.60,isDirect:false},
    ],
    roomTypes:[{name:"Queen Pool View",r:13604.76,occ:94},{name:"Triple (3 Single)",r:9462.58,occ:99},{name:"King Pool Access",r:8161.06,occ:95},{name:"Suite w/ Balcony",r:6196.59,occ:95},{name:"Micro Queen",r:4662.47,occ:95},{name:"Bunk Beds (Dorm)",r:4167.44,occ:74},{name:"1BR Apartment",r:2838.14,occ:116},{name:"Twin Pool View",r:2572.60,occ:94},{name:"Micro Twin",r:2489.30,occ:74}],
  },
  Feb:{label:"February",days:28,roomRevenue:53630.06,tax:6956.31,totalWithTax:60586.37,reservations:258,nights:635,occupancy:92,adr:84.46,revpar:77.95,canc:50,
    directRev:26321.84+2484.38+2444.06,
    channels:[
      {name:"Direct Bookings",r:26321.84+2484.38+2444.06,isDirect:true},
      {name:"Booking.com",r:19236.13,isDirect:false},
      {name:"Expedia",r:2515.17,isDirect:false},
      {name:"Hostelworld",r:628.48,isDirect:false},
    ],
    roomTypes:[{name:"Queen Pool View",r:13801.67,occ:98},{name:"Triple (3 Single)",r:8738.86,occ:95},{name:"King Pool Access",r:8307.97,occ:100},{name:"Suite w/ Balcony",r:5388.97,occ:95},{name:"Micro Queen",r:5111.30,occ:100},{name:"Bunk Beds (Dorm)",r:4360.98,occ:80},{name:"Twin Pool View",r:2756.32,occ:104},{name:"1BR Apartment",r:2655.41,occ:89},{name:"Micro Twin",r:2508.59,occ:86}],
  },
  Mar:{label:"March",days:31,roomRevenue:52978.67,tax:6887.23,totalWithTax:59865.90,reservations:287,nights:656,occupancy:85,adr:80.76,revpar:68.98,canc:63,
    directRev:14815.71+4610.55+5170.00+464.00,
    channels:[
      {name:"Direct Bookings",r:14815.71+4610.55+5170.00+464.00,isDirect:true},
      {name:"Booking.com",r:24994.72,isDirect:false},
      {name:"Expedia",r:2231.16,isDirect:false},
      {name:"Hostelworld",r:692.53,isDirect:false},
    ],
    roomTypes:[{name:"Queen Pool View",r:13580.11,occ:99},{name:"Triple (3 Single)",r:9895.73,occ:93},{name:"King Pool Access",r:7647.14,occ:97},{name:"Suite w/ Balcony",r:5968.92,occ:95},{name:"Micro Queen",r:4791.23,occ:95},{name:"Bunk Beds (Dorm)",r:3710.19,occ:55},{name:"1BR Apartment",r:2714.53,occ:97},{name:"Twin Pool View",r:2529.86,occ:87},{name:"Micro Twin",r:2140.96,occ:89}],
  },
  Apr:{label:"April",days:30,roomRevenue:39942.25,tax:5192.49,totalWithTax:45134.74,reservations:279,nights:590,occupancy:83,adr:67.70,revpar:56.10,canc:46,
    directRev:7376.71+5049.22+729.20+118.00,
    channels:[
      {name:"Direct Bookings",r:7376.71+5049.22+729.20+118.00,isDirect:true},
      {name:"Booking.com",r:21972.28,isDirect:false},
      {name:"Expedia",r:3841.62,isDirect:false},
      {name:"Hostelworld Group",r:855.22,isDirect:false},
    ],
    roomTypes:[{name:"Queen Pool View",r:9831.58,occ:92},{name:"Triple (3 Single)",r:7000.81,occ:88},{name:"King Pool Access",r:6058.45,occ:90},{name:"Suite w/ Balcony",r:5254.53,occ:100},{name:"Micro Queen",r:3760.38,occ:88},{name:"Bunk Beds (Dorm)",r:2491.06,occ:68},{name:"1BR Apartment",r:2257.87,occ:82},{name:"Micro Twin",r:1646.10,occ:58},{name:"Twin Pool View",r:1641.46,occ:77}],
  },
};

function BookingsTab({data, year}) {
  const fmtN = n => n.toLocaleString("en-US");
  const maxCh = Math.max(...data.channels_bookings.map(c=>c.bookings));
  const maxCo = Math.max(...data.countries.map(c=>c.bookings));
  const maxAg = Math.max(...data.agencies.map(a=>a.bookings));
  const agencyPct = (data.agency / data.total * 100).toFixed(1);
  const directBk = data.channels_bookings.filter(c=>c.name.includes("Extranet")||c.name.includes("Direct")||c.name.includes("Simple")||c.name.includes("Mobile")).reduce((a,c)=>a+c.bookings,0);
  const directPctBk = (directBk/data.total*100).toFixed(1);

  const BarRow = ({label,value,max,color,suffix=""}) => (
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
      <div style={{width:130,fontSize:11,color:C.darkWine,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={label}>{label}</div>
      <div style={{flex:1,height:8,background:C.blush,borderRadius:4,overflow:"hidden"}}>
        <div style={{width:`${(value/max)*100}%`,height:"100%",background:color||C.darkWine,borderRadius:4}}/>
      </div>
      <div style={{width:38,fontSize:11,color:C.muted,textAlign:"right",flexShrink:0}}>{fmtN(value)}{suffix}</div>
    </div>
  );

  return (
    <div>
      {/* Summary KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginTop:8,marginBottom:4}}>
        {[
          {icon:"📋",label:"Total Bookings",val:fmtN(data.total),color:C.darkWine},
          {icon:"🏢",label:"Agency Bookings",val:fmtN(data.agency),sub:`${agencyPct}% of total`,color:C.terracotta},
          {icon:"🔗",label:"Direct Bookings",val:fmtN(directBk),sub:`${directPctBk}% of total`,color:C.positive},
          {icon:"🌙",label:"Total Nights Sold",val:fmtN(data.total_nights),color:C.darkWine},
          {icon:"📅",label:"Avg Stay",val:`${data.avg_stay}n`,sub:"nights per booking",color:C.accent2},
          ...(data.total_revenue ? [{icon:"💰",label:"Total Revenue",val:"$"+fmt(data.total_revenue).slice(1),color:C.positive}] : []),
        ].map(k=>(
          <div key={k.label} style={{background:C.white,borderRadius:12,padding:"14px 16px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",borderLeft:`4px solid ${k.color}`}}>
            <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{k.icon} {k.label}</div>
            <div style={{fontSize:22,fontWeight:700,color:C.darkWine,lineHeight:1.1}}>{k.val}</div>
            {k.sub&&<div style={{fontSize:10,color:C.muted,marginTop:4}}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Monthly bookings + agency bar chart */}
      <Sec>Monthly Bookings — {year}</Sec>
      <div style={{background:C.white,borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)",marginBottom:4}}>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={data.monthly} margin={{top:8,right:8,bottom:0,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.blush}/>
            <XAxis dataKey="month" style={{fontSize:11}}/>
            <YAxis style={{fontSize:10}}/>
            <Tooltip content={<CTip f={v=>v.toLocaleString()}/>}/>
            <Bar dataKey="bookings" name="Direct/OTA" fill={C.muted} radius={[4,4,0,0]} stackId="a"/>
            <Bar dataKey="agency" name="Agency" fill={C.terracotta} radius={[4,4,0,0]} stackId="a"/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Avg stay line */}
      <div style={{background:C.white,borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)",marginBottom:4}}>
        <div style={{fontSize:11,fontWeight:600,color:C.darkWine,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Avg Stay by Month (nights)</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data.monthly} margin={{top:4,right:8,bottom:0,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.blush}/>
            <XAxis dataKey="month" style={{fontSize:11}}/>
            <YAxis domain={[0,4]} style={{fontSize:10}} tickFormatter={v=>v+"n"}/>
            <Tooltip content={<CTip f={v=>v+"n"}/>}/>
            <Bar dataKey="avg_stay" name="Avg Stay" radius={[4,4,0,0]}>
              {data.monthly.map((m,i)=><Cell key={i} fill={m.avg_stay>=2?C.darkWine:C.terracotta}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stay distribution + Channels */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:4}}>
        <div>
          <Sec>Stay Distribution</Sec>
          <div style={{background:C.white,borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.stay_dist} margin={{top:4,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.blush}/>
                <XAxis dataKey="nights" style={{fontSize:11}}/>
                <YAxis style={{fontSize:10}}/>
                <Tooltip content={<CTip f={v=>fmtN(v)+" bookings"}/>}/>
                <Bar dataKey="count" name="Bookings" fill={C.darkWine} radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
            <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
              {data.stay_dist.map(s=>(
                <div key={s.nights} style={{fontSize:11,color:C.muted}}><b style={{color:C.darkWine}}>{s.pct}%</b> {s.nights}</div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Sec>Across All Channels</Sec>
          <div style={{background:C.white,borderRadius:12,padding:"16px 20px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            {data.channels_bookings.map(c=>(
              <BarRow key={c.name} label={c.name} value={c.bookings} max={maxCh}
                color={c.name.includes("Extranet")||c.name.includes("Direct")||c.name.includes("Simple")||c.name.includes("Mobile")?C.positive:C.terracotta}/>
            ))}
          </div>
        </div>
      </div>

      {/* Countries + Agencies */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <Sec>Top Source Countries</Sec>
          <div style={{background:C.white,borderRadius:12,padding:"16px 20px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            {data.countries.map(c=>(
              <BarRow key={c.country} label={c.country} value={c.bookings} max={maxCo} color={C.darkWine}/>
            ))}
          </div>
        </div>
        <div>
          <Sec>Agency Volume</Sec>
          <div style={{background:C.white,borderRadius:12,padding:"16px 20px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            {data.agencies.map(a=>(
              <BarRow key={a.name} label={a.name} value={a.bookings} max={maxAg} color={C.terracotta}/>
            ))}
            <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`,fontSize:11,color:C.muted}}>
              Total agency bookings: <b style={{color:C.darkWine}}>{fmtN(data.agency)}</b> · Share: <b style={{color:C.terracotta}}>{agencyPct}%</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function YoYDashboard() {
  const [tab, setTab] = useState("Year vs Year");

  // direct revenue calc
  const dir25 = Y2025.channels.filter(c=>c.isDirect).reduce((a,c)=>a+c.revenue,0);
  const dir26 = Y2026.channels.filter(c=>c.isDirect).reduce((a,c)=>a+c.revenue,0);
  const dir26Ann = dir26 * ANNUALIZE;

  const kpis = [
    {label:"Room Revenue",icon:"🏨",v25:S25.roomRevenue,v26:S26.roomRevenue,v26ann:proj26.roomRevenue,fmt:"$"},
    {label:"Rev incl. Tax",icon:"💰",v25:S25.totalWithTax,v26:S26.totalWithTax,v26ann:proj26.totalWithTax,fmt:"$"},
    {label:"Occupancy",icon:"📊",v25:S25.occupancy,v26:S26.occupancy,v26ann:null,fmt:"pct"},
    {label:"ADR",icon:"📈",v25:S25.adr,v26:S26.adr,v26ann:null,fmt:"$"},
    {label:"RevPAR",icon:"💎",v25:S25.revpar,v26:S26.revpar,v26ann:null,fmt:"$"},
    {label:"Reservations",icon:"📋",v25:S25.reservations,v26:S26.reservations,v26ann:proj26.reservations,fmt:"int"},
    {label:"Cancellations",icon:"❌",v25:S25.cancellations,v26:S26.cancellations,v26ann:proj26.cancellations,fmt:"int"},
    {label:"Direct %",icon:"🔗",v25:+(dir25/S25.roomRevenue*100).toFixed(1),v26:+(dir26/S26.roomRevenue*100).toFixed(1),v26ann:null,fmt:"pct"},
  ];

  const trendBar = [
    {label:"Room Rev",v25:S25.roomRevenue/1000,v26:S26.roomRevenue/1000,v26p:proj26.roomRevenue/1000},
    {label:"Rev+Tax",v25:S25.totalWithTax/1000,v26:S26.totalWithTax/1000,v26p:proj26.totalWithTax/1000},
  ];

  const kpiRadar = [
    {metric:"Occupancy",v25:S25.occupancy,v26:S26.occupancy},
    {metric:"ADR (÷100)",v25:S25.adr,v26:S26.adr},
    {metric:"RevPAR (÷100)",v25:S25.revpar,v26:S26.revpar},
    {metric:"Direct%",v25:+(dir25/S25.roomRevenue*100).toFixed(1),v26:+(dir26/S26.roomRevenue*100).toFixed(1)},
  ];

  // Channel YoY — consolidated direct
  const chYoY = Y2025.channels.map(c25=>{
    const c26=Y2026.channels.find(x=>x.name===c25.name)||{revenue:0,res:0,canc:0,nights:0};
    return {name:c25.name,v25:c25.revenue,v26:c26.revenue,v26ann:c26.revenue*ANNUALIZE,isDirect:c25.isDirect};
  });
  Y2026.channels.forEach(c26=>{
    if(!Y2025.channels.find(x=>x.name===c26.name)) chYoY.push({name:c26.name,v25:0,v26:c26.revenue,v26ann:c26.revenue*ANNUALIZE,isDirect:c26.isDirect});
  });

  // Room type YoY
  const rtYoY = Y2025.roomTypes.map(rt25=>{
    const rt26=Y2026.roomTypes.find(x=>x.name===rt25.name)||{revenue:0,occ:0,adr:0,revpar:0};
    return {name:rt25.name,v25rev:rt25.revenue,v26rev:rt26.revenue,v26revAnn:rt26.revenue*ANNUALIZE,v25occ:rt25.occ,v26occ:rt26.occ,v25adr:rt25.adr,v26adr:rt26.adr,v25revpar:rt25.revpar,v26revpar:rt26.revpar};
  });

  // Room YoY
  const roomYoY = Y2025.rooms.filter(r=>!r.name.includes("nalloc")).map(r25=>{
    const r26=Y2026.rooms.find(x=>x.name===r25.name)||{revenue:0,occ:0,adr:0,revpar:0};
    return {name:r25.name,v25rev:r25.revenue,v26rev:r26.revenue,v25occ:r25.occ,v26occ:r26.occ,v25adr:r25.adr,v26adr:r26.adr,isDorm:r25.name.startsWith("Bed")};
  });

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.cream,minHeight:"100vh",color:C.darkWine}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      {/* Header */}
      <div style={{background:C.darkWine,padding:"22px 24px 16px",color:C.cream}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,letterSpacing:1.5}}>HOTEL YULI</div>
            <div style={{fontSize:12,opacity:0.65,marginTop:2}}>Year-over-Year Comparison · 2025 Full Year vs 2026 YTD (Jan–Apr)</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.1)",borderRadius:10,padding:"10px 18px",textAlign:"right"}}>
            <div style={{fontSize:10,opacity:0.6,textTransform:"uppercase",letterSpacing:1}}>2026 YTD Period</div>
            <div style={{fontSize:14,fontWeight:700}}>Jan 1 – Apr 30</div>
            <div style={{fontSize:11,opacity:0.6}}>120 days · Ann. factor ×{ANNUALIZE.toFixed(2)}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:3,marginTop:14,flexWrap:"wrap"}}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:tab===t?"rgba(250,248,245,0.18)":"transparent",color:tab===t?C.cream:"rgba(250,248,245,0.45)"}}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"18px 24px 40px",maxWidth:1200,margin:"0 auto"}}>

        {tab==="Year vs Year"&&(
          <>
            {/* Legend */}
            <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:4,marginTop:6,fontSize:12}}>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:14,height:14,borderRadius:3,background:C.muted,display:"inline-block"}}/> 2025 (Full Year)</span>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:14,height:14,borderRadius:3,background:C.terracotta,display:"inline-block"}}/> 2026 YTD (Jan–Apr)</span>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:14,height:14,borderRadius:3,background:C.darkWine,display:"inline-block"}}/> 2026 Annualized Projection</span>
            </div>

            {/* KPI Grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginTop:4}}>
              {kpis.map(k=>{
                const fmtV = v => k.fmt==="$"?fmt(v):k.fmt==="pct"?v+"%":v.toLocaleString();
                const d = dlt(k.v26, k.v25 / (k.fmt==="$"||k.fmt==="int" ? ANNUALIZE : 1));
                const isGood = k.label==="Cancellations" ? (d!=null&&d<0) : (d!=null&&d>0);
                return(
                  <div key={k.label} style={{background:C.white,borderRadius:12,padding:"14px 16px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",borderTop:`3px solid ${C.terracotta}`}}>
                    <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{k.icon} {k.label}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                      <div>
                        <div style={{fontSize:10,color:C.muted,marginBottom:2}}>2025</div>
                        <div style={{fontSize:16,fontWeight:700,color:C.muted}}>{fmtV(k.v25)}</div>
                      </div>
                      <div>
                        <div style={{fontSize:10,color:C.terracotta,marginBottom:2}}>2026 YTD</div>
                        <div style={{fontSize:16,fontWeight:700,color:C.darkWine}}>{fmtV(k.v26)}</div>
                      </div>
                    </div>
                    {k.v26ann!=null&&(
                      <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
                        <div style={{fontSize:10,color:C.muted,marginBottom:2}}>2026 Projected (Full Year)</div>
                        <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                          <span style={{fontSize:14,fontWeight:700,color:C.darkWine}}>{fmtV(Math.round(k.v26ann))}</span>
                          <Dlt val={dlt(k.v26ann,k.v25)} inv={k.label==="Cancellations"}/>
                        </div>
                      </div>
                    )}
                    {k.v26ann==null&&(
                      <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:4}}>
                        <span style={{fontSize:10,color:C.muted}}>YoY (vs 2025 avg):</span>
                        <Dlt val={d} inv={k.label==="Cancellations"}/>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Revenue bar + KPI line */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:4}}>
              <div>
                <Sec>Revenue Comparison</Sec>
                <div style={{background:C.white,borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={[
                      {name:"Room Rev",y25:S25.roomRevenue/1000,ytd:S26.roomRevenue/1000,proj:proj26.roomRevenue/1000},
                      {name:"Total+Tax",y25:S25.totalWithTax/1000,ytd:S26.totalWithTax/1000,proj:proj26.totalWithTax/1000},
                    ]} margin={{top:8,right:8,bottom:0,left:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.blush}/>
                      <XAxis dataKey="name" style={{fontSize:11}}/>
                      <YAxis tickFormatter={v=>`$${v.toFixed(0)}k`} style={{fontSize:10}}/>
                      <Tooltip content={<CTip f={v=>`$${v.toFixed(1)}k`}/>}/>
                      <Bar dataKey="y25" name="2025 Full Year" fill={C.muted} radius={[5,5,0,0]} barSize={30}/>
                      <Bar dataKey="ytd" name="2026 YTD" fill={C.terracotta} radius={[5,5,0,0]} barSize={30}/>
                      <Bar dataKey="proj" name="2026 Projected" fill={C.darkWine} radius={[5,5,0,0]} barSize={30}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <Sec>KPI Comparison</Sec>
                <div style={{background:C.white,borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={[
                      {name:"Occ%",y25:S25.occupancy,y26:S26.occupancy},
                      {name:"ADR",y25:S25.adr,y26:S26.adr},
                      {name:"RevPAR",y25:S25.revpar,y26:S26.revpar},
                    ]} margin={{top:8,right:8,bottom:0,left:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.blush}/>
                      <XAxis dataKey="name" style={{fontSize:11}}/>
                      <YAxis style={{fontSize:10}}/>
                      <Tooltip content={<CTip f={v=>v.toFixed(2)}/>}/>
                      <Bar dataKey="y25" name="2025" fill={C.muted} radius={[5,5,0,0]} barSize={34}/>
                      <Bar dataKey="y26" name="2026 YTD" fill={C.darkWine} radius={[5,5,0,0]} barSize={34}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Summary comparison table */}
            <Sec>Full Metrics Comparison</Sec>
            <div style={{background:C.white,borderRadius:12,overflow:"auto",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{background:C.darkWine,color:C.cream}}>
                  <TH left>Metric</TH><TH>2025 Full Year</TH><TH>2026 YTD (Jan–Apr)</TH><TH>2026 Projected</TH><TH>YoY Δ (Proj vs 2025)</TH>
                </tr></thead>
                <tbody>
                  {[
                    {label:"Room Revenue",v25:fmt(S25.roomRevenue),v26:fmt(S26.roomRevenue),vp:fmt(proj26.roomRevenue),d:dlt(proj26.roomRevenue,S25.roomRevenue)},
                    {label:"Revenue incl. Tax",v25:fmt(S25.totalWithTax),v26:fmt(S26.totalWithTax),vp:fmt(proj26.totalWithTax),d:dlt(proj26.totalWithTax,S25.totalWithTax)},
                    {label:"Occupancy",v25:S25.occupancy+"%",v26:S26.occupancy+"%",vp:"—",d:dlt(S26.occupancy,S25.occupancy)},
                    {label:"ADR",v25:fmt(S25.adr),v26:fmt(S26.adr),vp:"—",d:dlt(S26.adr,S25.adr)},
                    {label:"RevPAR",v25:fmt(S25.revpar),v26:fmt(S26.revpar),vp:"—",d:dlt(S26.revpar,S25.revpar)},
                    {label:"Room Nights",v25:S25.nights.toLocaleString(),v26:S26.nights.toLocaleString(),vp:proj26.nights.toLocaleString(),d:dlt(proj26.nights,S25.nights)},
                    {label:"Reservations",v25:S25.reservations.toLocaleString(),v26:S26.reservations.toLocaleString(),vp:proj26.reservations.toLocaleString(),d:dlt(proj26.reservations,S25.reservations)},
                    {label:"Cancellations",v25:S25.cancellations.toLocaleString(),v26:S26.cancellations.toLocaleString(),vp:proj26.cancellations.toLocaleString(),d:dlt(proj26.cancellations,S25.cancellations),inv:true},
                    {label:"Direct %",v25:(dir25/S25.roomRevenue*100).toFixed(1)+"%",v26:(dir26/S26.roomRevenue*100).toFixed(1)+"%",vp:"—",d:dlt(dir26/S26.roomRevenue*100,dir25/S25.roomRevenue*100)},
                    {label:"Avg Lead Time",v25:S25.lead+"d",v26:S26.lead+"d",vp:"—",d:dlt(S26.lead,S25.lead)},
                  ].map((r,i)=>(
                    <tr key={r.label} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.white:C.blush}}>
                      <TD left bold>{r.label}</TD>
                      <TD color={C.muted}>{r.v25}</TD>
                      <TD color={C.terracotta} bold>{r.v26}</TD>
                      <TD bold>{r.vp}</TD>
                      <TD><Dlt val={r.d} inv={r.inv}/></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:8,fontStyle:"italic"}}>* 2026 Projected = YTD annualized (×{ANNUALIZE.toFixed(2)}). Jan–Apr is peak season — full-year projection may be optimistic.</div>

            {/* Bookings overview strip */}
            <Sec>Bookings Overview</Sec>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginBottom:4}}>
              {[
                {icon:"📋",label:"2025 Total Bookings",val:"2,915",sub:"Excl. cancellations",color:C.muted},
                {icon:"📋",label:"2026 Q1 Bookings",val:"958",sub:"Jan–Mar 2026",color:C.darkWine},
                {icon:"💰",label:"2025 Total Revenue",val:"$416,184",sub:"From reservations data",color:C.positive},
                {icon:"🏢",label:"2025 Agency Share",val:"4.2%",sub:"122 of 2,915 bookings",color:C.terracotta},
                {icon:"🏢",label:"Q1 2026 Agency Share",val:"11.7%",sub:"112 of 958 — ×2.8 YoY",color:C.terracotta},
                {icon:"📅",label:"Avg Stay 2025",val:"1.82n",sub:"Q1 2026: 2.01n (+10.4%)"},
              ].map(k=>(
                <div key={k.label} style={{background:C.white,borderRadius:12,padding:"14px 16px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",borderLeft:`4px solid ${k.color||C.accent2}`}}>
                  <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{k.icon} {k.label}</div>
                  <div style={{fontSize:20,fontWeight:700,color:C.darkWine,lineHeight:1.1}}>{k.val}</div>
                  {k.sub&&<div style={{fontSize:10,color:C.muted,marginTop:4}}>{k.sub}</div>}
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:4}}>
              <div style={{background:C.white,borderRadius:12,padding:"16px 20px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                <div style={{fontSize:11,fontWeight:700,color:C.darkWine,textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>Top Source Countries 2025</div>
                {BOOKINGS_2025.countries.slice(0,8).map(c=>{const max=362;return(
                  <div key={c.country} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{width:110,fontSize:11,color:C.darkWine,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.country}</div>
                    <div style={{flex:1,height:7,background:C.blush,borderRadius:3,overflow:"hidden"}}><div style={{width:`${(c.bookings/max)*100}%`,height:"100%",background:C.darkWine,borderRadius:3}}/></div>
                    <div style={{width:30,fontSize:11,color:C.muted,textAlign:"right"}}>{c.bookings}</div>
                  </div>
                );})}
              </div>
              <div style={{background:C.white,borderRadius:12,padding:"16px 20px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                <div style={{fontSize:11,fontWeight:700,color:C.darkWine,textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>Top Source Countries Q1 2026</div>
                {BOOKINGS_Q1_2026.countries.slice(0,8).map(c=>{const max=85;return(
                  <div key={c.country} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{width:110,fontSize:11,color:C.darkWine,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.country}</div>
                    <div style={{flex:1,height:7,background:C.blush,borderRadius:3,overflow:"hidden"}}><div style={{width:`${(c.bookings/max)*100}%`,height:"100%",background:C.terracotta,borderRadius:3}}/></div>
                    <div style={{width:30,fontSize:11,color:C.muted,textAlign:"right"}}>{c.bookings}</div>
                  </div>
                );})}
              </div>
              <div style={{background:C.white,borderRadius:12,padding:"16px 20px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                <div style={{fontSize:11,fontWeight:700,color:C.darkWine,textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>Agency Volume — Q1 2026</div>
                {BOOKINGS_Q1_2026.agencies.map(a=>{const max=31;return(
                  <div key={a.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{width:110,fontSize:11,color:C.darkWine,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                    <div style={{flex:1,height:7,background:C.blush,borderRadius:3,overflow:"hidden"}}><div style={{width:`${(a.bookings/max)*100}%`,height:"100%",background:C.terracotta,borderRadius:3}}/></div>
                    <div style={{width:30,fontSize:11,color:C.muted,textAlign:"right"}}>{a.bookings}</div>
                  </div>
                );})}
              </div>
            </div>
          </>
        )}

        {tab==="Channels"&&(
          <>
            <Sec>Channel Revenue: 2025 vs 2026</Sec>
            <div style={{background:C.white,borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[...chYoY].sort((a,b)=>b.v25-a.v25)} layout="vertical" margin={{left:115,right:16}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.blush} horizontal={false}/>
                  <XAxis type="number" tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} style={{fontSize:11}}/>
                  <YAxis type="category" dataKey="name" style={{fontSize:10}} width={105}/>
                  <Tooltip content={<CTip f={fmt}/>}/>
                  <Bar dataKey="v25" name="2025 Full Year" fill={C.muted} radius={[0,4,4,0]} barSize={14}/>
                  <Bar dataKey="v26ann" name="2026 Projected" fill={C.darkWine} radius={[0,4,4,0]} barSize={14}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Sec>Channel Detail Table</Sec>
            <div style={{background:C.white,borderRadius:12,overflow:"auto",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{background:C.darkWine,color:C.cream}}>
                  <TH left>Channel</TH><TH>Type</TH><TH>2025 Revenue</TH><TH>2025 Share</TH><TH>2026 YTD</TH><TH>2026 Share</TH><TH>2026 Proj.</TH><TH>YoY Δ</TH>
                </tr></thead>
                <tbody>
                  {[...chYoY].sort((a,b)=>b.v25-a.v25).map((c,i)=>(
                    <tr key={c.name} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.white:C.blush}}>
                      <TD left bold>{c.name}</TD>
                      <TD><span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:c.isDirect?"#e8f5e9":"#fff3e0",color:c.isDirect?C.positive:"#e65100",fontWeight:600}}>{c.isDirect?"DIRECT":"OTA"}</span></TD>
                      <TD color={C.muted}>{c.v25>0?fmt(c.v25):"—"}</TD>
                      <TD color={C.muted}>{c.v25>0?((c.v25/S25.roomRevenue)*100).toFixed(1)+"%":"—"}</TD>
                      <TD color={C.terracotta} bold>{c.v26>0?fmt(c.v26):"—"}</TD>
                      <TD color={C.terracotta}>{c.v26>0?((c.v26/S26.roomRevenue)*100).toFixed(1)+"%":"—"}</TD>
                      <TD bold>{c.v26ann>0?fmt(c.v26ann):"—"}</TD>
                      <TD><Dlt val={c.v25>0?dlt(c.v26ann,c.v25):null}/></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab==="Room Types"&&(
          <>
            <Sec>Revenue by Room Type: 2025 vs 2026 Projected</Sec>
            <div style={{background:C.white,borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[...rtYoY].sort((a,b)=>b.v25rev-a.v25rev)} layout="vertical" margin={{left:125,right:16}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.blush} horizontal={false}/>
                  <XAxis type="number" tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} style={{fontSize:11}}/>
                  <YAxis type="category" dataKey="name" style={{fontSize:10}} width={115}/>
                  <Tooltip content={<CTip f={fmt}/>}/>
                  <Bar dataKey="v25rev" name="2025 Full Year" fill={C.muted} radius={[0,4,4,0]} barSize={14}/>
                  <Bar dataKey="v26revAnn" name="2026 Projected" fill={C.darkWine} radius={[0,4,4,0]} barSize={14}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Sec>Room Type Detail Table</Sec>
            <div style={{background:C.white,borderRadius:12,overflow:"auto",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:C.darkWine,color:C.cream}}>
                  <TH left>Type</TH>
                  <TH>2025 Rev</TH><TH>2025 Occ%</TH><TH>2025 ADR</TH><TH>2025 RevPAR</TH>
                  <TH>2026 YTD</TH><TH>2026 Occ%</TH><TH>2026 ADR</TH><TH>2026 RevPAR</TH>
                  <TH>Rev Δ</TH>
                </tr></thead>
                <tbody>
                  {[...rtYoY].sort((a,b)=>b.v25rev-a.v25rev).map((rt,i)=>(
                    <tr key={rt.name} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.white:C.blush}}>
                      <TD left bold small>{rt.name}</TD>
                      <TD color={C.muted} small>{fmt(rt.v25rev)}</TD>
                      <TD color={rt.v25occ>=85?C.positive:C.muted} small>{rt.v25occ}%</TD>
                      <TD color={C.muted} small>{fmt(rt.v25adr)}</TD>
                      <TD color={C.muted} small>{fmt(rt.v25revpar)}</TD>
                      <TD color={C.terracotta} bold small>{fmt(rt.v26rev)}</TD>
                      <TD bold color={rt.v26occ>=90?C.positive:rt.v26occ>=75?C.darkWine:C.warning} small>{rt.v26occ}%</TD>
                      <TD bold small>{fmt(rt.v26adr)}</TD>
                      <TD bold small>{fmt(rt.v26revpar)}</TD>
                      <TD small><Dlt val={dlt(rt.v26revAnn,rt.v25rev)}/></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab==="Rooms"&&(
          <>
            <Sec>Room Revenue: 2025 Full Year vs 2026 YTD</Sec>
            <div style={{background:C.white,borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <ResponsiveContainer width="100%" height={Math.max(380,roomYoY.length*24)}>
                <BarChart data={[...roomYoY].sort((a,b)=>b.v25rev-a.v25rev)} layout="vertical" margin={{left:70,right:16}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.blush} horizontal={false}/>
                  <XAxis type="number" tickFormatter={v=>`$${(v/1000).toFixed(1)}k`} style={{fontSize:10}}/>
                  <YAxis type="category" dataKey="name" style={{fontSize:10}} width={60}/>
                  <Tooltip content={<CTip f={fmt}/>}/>
                  <Bar dataKey="v25rev" name="2025 Full Year" fill={C.muted} radius={[0,4,4,0]} barSize={12}/>
                  <Bar dataKey="v26rev" name="2026 YTD" fill={C.darkWine} radius={[0,4,4,0]} barSize={12}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Sec>Room Detail Table</Sec>
            <div style={{background:C.white,borderRadius:12,overflow:"auto",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:C.darkWine,color:C.cream}}>
                  <TH left>Room</TH>
                  <TH>2025 Rev</TH><TH>2025 Occ%</TH><TH>2025 ADR</TH>
                  <TH>2026 YTD Rev</TH><TH>2026 Occ%</TH><TH>2026 ADR</TH>
                  <TH>ADR Δ</TH><TH>Occ Δ</TH>
                </tr></thead>
                <tbody>
                  {[...roomYoY].sort((a,b)=>b.v25rev-a.v25rev).map((r,i)=>(
                    <tr key={r.name} style={{borderBottom:`1px solid ${C.border}`,background:r.isDorm?C.blush:(i%2===0?C.white:C.cream)}}>
                      <TD left bold color={r.isDorm?C.muted:C.darkWine}>{r.name}</TD>
                      <TD color={C.muted}>{fmt(r.v25rev)}</TD>
                      <TD color={r.v25occ>=80?C.positive:C.muted}>{r.v25occ}%</TD>
                      <TD color={C.muted}>{fmt(r.v25adr)}</TD>
                      <TD bold color={C.terracotta}>{r.v26rev>0?fmt(r.v26rev):"—"}</TD>
                      <TD bold color={r.v26occ>=90?C.positive:r.v26occ>=75?C.darkWine:C.warning}>{r.v26occ>0?r.v26occ+"%":"—"}</TD>
                      <TD bold>{r.v26adr>0?fmt(r.v26adr):"—"}</TD>
                      <TD><Dlt val={r.v26adr>0?dlt(r.v26adr,r.v25adr):null}/></TD>
                      <TD><Dlt val={r.v26occ>0?dlt(r.v26occ,r.v25occ):null}/></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab==="Monthly 2026"&&<Monthly2026Tab/>}
        {tab==="Bookings 2025"&&<BookingsTab data={{...BOOKINGS_2025,total_revenue:416183.91}} year="Full Year 2025"/>}
        {tab==="Bookings Q1 2026"&&<BookingsTab data={BOOKINGS_Q1_2026} year="Q1 2026 (Jan–Mar)"/>}
      </div>
      <div style={{textAlign:"center",padding:"12px",color:C.muted,fontSize:10,borderTop:`1px solid ${C.border}`}}>Hotel Yuli · Uvita, Costa Rica · Pick Your Destination S.R.L. · 2025 Full Year vs 2026 Jan–Apr</div>
    </div>
  );
}

function Monthly2026Tab() {
  const MKEYS26 = Object.keys(MONTHLY2026);
  const [selMonth, setSelMonth] = useState("Jan");

  const trendData = MKEYS26.map(k=>{
    const m=MONTHLY2026[k];
    return{month:k,revenue:m.totalWithTax,roomRev:m.roomRevenue,occ:m.occupancy,adr:m.adr,revpar:m.revpar,directPct:+(m.directRev/m.roomRevenue*100).toFixed(1)};
  });

  const mActive = MONTHLY2026[selMonth];
  const mIdx = MKEYS26.indexOf(selMonth);
  const mPrev = mIdx>0?MONTHLY2026[MKEYS26[mIdx-1]]:null;
  const directPct = +(mActive.directRev/mActive.roomRevenue*100).toFixed(1);
  const otaRev = mActive.roomRevenue - mActive.directRev;

  const CTipL=({active,payload,label})=>{if(!active||!payload?.length)return null;return(<div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:12,boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}><div style={{fontWeight:600,marginBottom:3,color:C.darkWine}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color}}>{p.name}: {typeof p.value==="number"&&p.value<200?p.value%1===0?p.value+"%":"$"+p.value.toFixed(2):fmt(p.value)}</div>)}</div>);};

  return(
    <div>
      <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
        {MKEYS26.map(k=>(
          <button key={k} onClick={()=>setSelMonth(k)} style={{padding:"7px 18px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:selMonth===k?C.darkWine:C.white,color:selMonth===k?C.cream:C.darkWine,boxShadow:"0 1px 3px rgba(0,0,0,0.08)",transition:"all 0.2s"}}>{MONTHLY2026[k].label}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,marginTop:16}}>
        {[
          {icon:"💰",label:"Revenue (incl. tax)",val:fmt(mActive.totalWithTax),d:mPrev?dlt(mActive.totalWithTax,mPrev.totalWithTax):null,accent:C.darkWine},
          {icon:"🏨",label:"Room Revenue",val:fmt(mActive.roomRevenue),d:mPrev?dlt(mActive.roomRevenue,mPrev.roomRevenue):null},
          {icon:"📊",label:"Occupancy",val:mActive.occupancy+"%",d:mPrev?dlt(mActive.occupancy,mPrev.occupancy):null,accent:C.positive},
          {icon:"📈",label:"ADR",val:fmt(mActive.adr),d:mPrev?dlt(mActive.adr,mPrev.adr):null},
          {icon:"💎",label:"RevPAR",val:fmt(mActive.revpar),d:mPrev?dlt(mActive.revpar,mPrev.revpar):null},
          {icon:"📋",label:"Reservations",val:mActive.reservations,d:mPrev?dlt(mActive.reservations,mPrev.reservations):null,accent:C.muted},
          {icon:"❌",label:"Cancellations",val:mActive.canc,d:mPrev?dlt(mActive.canc,mPrev.canc):null,accent:C.negative,inv:true},
          {icon:"🔗",label:"Direct %",val:directPct+"%",d:mPrev?dlt(directPct,+(mPrev.directRev/mPrev.roomRevenue*100).toFixed(1)):null},
        ].map(k=>(
          <div key={k.label} style={{background:C.white,borderRadius:12,padding:"14px 16px",borderLeft:`4px solid ${k.accent||C.terracotta}`,boxShadow:"0 1px 4px rgba(0,0,0,0.05)",display:"flex",flexDirection:"column",gap:2}}>
            <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>{k.icon} {k.label}</div>
            <div style={{display:"flex",alignItems:"baseline"}}>
              <span style={{fontSize:20,fontWeight:700,color:C.darkWine,lineHeight:1.1}}>{k.val}</span>
              {k.d!=null&&<Dlt val={k.d} inv={k.inv}/>}
            </div>
            {mPrev&&<div style={{fontSize:10,color:C.muted}}>prev month: {k.icon==="💰"?fmt(mPrev.totalWithTax):k.icon==="🏨"?fmt(mPrev.roomRevenue):k.icon==="📊"?mPrev.occupancy+"%":k.icon==="📈"?fmt(mPrev.adr):k.icon==="💎"?fmt(mPrev.revpar):k.icon==="📋"?mPrev.reservations:k.icon==="❌"?mPrev.canc:+(mPrev.directRev/mPrev.roomRevenue*100).toFixed(1)+"%"}</div>}
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:4}}>
        <div>
          <Sec>Revenue by Month</Sec>
          <div style={{background:C.white,borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.blush}/>
                <XAxis dataKey="month" style={{fontSize:11}}/>
                <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} style={{fontSize:10}}/>
                <Tooltip content={<CTipL/>}/>
                <Bar dataKey="revenue" name="Total (w/ tax)" radius={[5,5,0,0]} barSize={36}>
                  {trendData.map(d=><Cell key={d.month} fill={d.month===selMonth?C.darkWine:C.terracotta}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <Sec>ADR · RevPAR · Occ% Trend</Sec>
          <div style={{background:C.white,borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.blush}/>
                <XAxis dataKey="month" style={{fontSize:11}}/>
                <YAxis style={{fontSize:10}}/>
                <Tooltip content={<CTipL/>}/>
                <Line type="monotone" dataKey="occ" name="Occupancy%" stroke={C.positive} strokeWidth={2} dot={{r:5, fill:C.positive}}/>
                <Line type="monotone" dataKey="adr" name="ADR" stroke={C.darkWine} strokeWidth={2} dot={{r:5, fill:C.darkWine}}/>
                <Line type="monotone" dataKey="revpar" name="RevPAR" stroke={C.terracotta} strokeWidth={2} dot={{r:5, fill:C.terracotta}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:16,marginTop:4}}>
        <div>
          <Sec>Direct vs OTA</Sec>
          <div style={{background:C.white,borderRadius:12,padding:14,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={[{name:"Direct",value:mActive.directRev},{name:"OTA",value:otaRev}]} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" paddingAngle={3} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} style={{fontSize:10}}>
                  <Cell fill={C.positive}/><Cell fill={C.terracotta}/>
                </Pie>
                <Tooltip formatter={v=>fmt(v)}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{textAlign:"center",fontSize:11,color:C.muted}}>Direct: <b style={{color:C.positive}}>{directPct}%</b></div>
          </div>
        </div>
        <div>
          <Sec>Channels — {mActive.label}</Sec>
          <div style={{background:C.white,borderRadius:12,overflow:"auto",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:C.darkWine,color:C.cream}}>
                <th style={{padding:"8px 10px",textAlign:"left",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Channel</th>
                <th style={{padding:"8px 10px",textAlign:"center",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Type</th>
                <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Revenue</th>
                <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Share</th>
              </tr></thead>
              <tbody>
                {[...mActive.channels].sort((a,b)=>b.r-a.r).map((c,i)=>{
                  const isD=c.isDirect;
                  return(<tr key={c.name} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.white:C.blush}}>
                    <td style={{padding:"8px 10px",fontWeight:600,color:C.darkWine}}>{c.name}</td>
                    <td style={{padding:"8px 10px",textAlign:"center"}}><span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:isD?"#e8f5e9":"#fff3e0",color:isD?C.positive:"#e65100",fontWeight:600}}>{isD?"DIRECT":"OTA"}</span></td>
                    <td style={{padding:"8px 10px",textAlign:"right",fontWeight:600}}>{fmt(c.r)}</td>
                    <td style={{padding:"8px 10px",textAlign:"right"}}>{((c.r/mActive.roomRevenue)*100).toFixed(1)}%</td>
                  </tr>);
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Sec>Room Types — {mActive.label}</Sec>
      <div style={{background:C.white,borderRadius:12,overflow:"auto",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.darkWine,color:C.cream}}>
            <th style={{padding:"8px 10px",textAlign:"left",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Room Type</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Revenue</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Share</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Occ%</th>
          </tr></thead>
          <tbody>
            {[...mActive.roomTypes].sort((a,b)=>b.r-a.r).map((rt,i)=>(
              <tr key={rt.name} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.white:C.blush}}>
                <td style={{padding:"8px 10px",fontWeight:600,color:C.darkWine}}>{rt.name}</td>
                <td style={{padding:"8px 10px",textAlign:"right"}}>{fmt(rt.r)}</td>
                <td style={{padding:"8px 10px",textAlign:"right"}}>{((rt.r/mActive.roomRevenue)*100).toFixed(1)}%</td>
                <td style={{padding:"8px 10px",textAlign:"right",fontWeight:600,color:rt.occ>=95?C.positive:rt.occ>=80?C.darkWine:C.warning}}>{rt.occ}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sec>All Months at a Glance</Sec>
      <div style={{background:C.white,borderRadius:12,overflow:"auto",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.darkWine,color:C.cream}}>
            <th style={{padding:"8px 10px",textAlign:"left",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Month</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Rev+Tax</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Room Rev</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Nights</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Occ%</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>ADR</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>RevPAR</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Res.</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Canc.</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>Direct%</th>
          </tr></thead>
          <tbody>
            {MKEYS26.map((k,i)=>{
              const m=MONTHLY2026[k];
              const dp=+(m.directRev/m.roomRevenue*100).toFixed(1);
              return(<tr key={k} style={{borderBottom:`1px solid ${C.border}`,background:k===selMonth?C.blush:i%2===0?C.white:C.cream,cursor:"pointer"}} onClick={()=>setSelMonth(k)}>
                <td style={{padding:"8px 10px",fontWeight:700,color:k===selMonth?C.darkWine:C.terracotta}}>{m.label}</td>
                <td style={{padding:"8px 10px",textAlign:"right"}}>{fmt(m.totalWithTax)}</td>
                <td style={{padding:"8px 10px",textAlign:"right"}}>{fmt(m.roomRevenue)}</td>
                <td style={{padding:"8px 10px",textAlign:"right"}}>{m.nights}</td>
                <td style={{padding:"8px 10px",textAlign:"right",fontWeight:600,color:m.occupancy>=90?C.positive:m.occupancy>=80?C.darkWine:C.warning}}>{m.occupancy}%</td>
                <td style={{padding:"8px 10px",textAlign:"right"}}>{fmt(m.adr)}</td>
                <td style={{padding:"8px 10px",textAlign:"right",fontWeight:600}}>{fmt(m.revpar)}</td>
                <td style={{padding:"8px 10px",textAlign:"right"}}>{m.reservations}</td>
                <td style={{padding:"8px 10px",textAlign:"right",color:m.canc>60?C.negative:C.darkWine}}>{m.canc}</td>
                <td style={{padding:"8px 10px",textAlign:"right",color:dp>=55?C.positive:C.darkWine,fontWeight:600}}>{dp}%</td>
              </tr>);
            })}
            <tr style={{background:C.blush,borderTop:`2px solid ${C.darkWine}`}}>
              <td style={{padding:"8px 10px",fontWeight:700,color:C.darkWine}}>YTD Total</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontWeight:700}}>{fmt(MKEYS26.reduce((a,k)=>a+MONTHLY2026[k].totalWithTax,0))}</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontWeight:700}}>{fmt(MKEYS26.reduce((a,k)=>a+MONTHLY2026[k].roomRevenue,0))}</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontWeight:700}}>{MKEYS26.reduce((a,k)=>a+MONTHLY2026[k].nights,0)}</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontWeight:700}}>—</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontWeight:700}}>{fmt(MKEYS26.reduce((a,k)=>a+MONTHLY2026[k].roomRevenue,0)/MKEYS26.reduce((a,k)=>a+MONTHLY2026[k].nights,0))}</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontWeight:700}}>—</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontWeight:700}}>{MKEYS26.reduce((a,k)=>a+MONTHLY2026[k].reservations,0)}</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontWeight:700}}>{MKEYS26.reduce((a,k)=>a+MONTHLY2026[k].canc,0)}</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontWeight:700}}>{+(MKEYS26.reduce((a,k)=>a+MONTHLY2026[k].directRev,0)/MKEYS26.reduce((a,k)=>a+MONTHLY2026[k].roomRevenue,0)*100).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
