import { Users, Receipt, Send, MailPlus, Inbox, UserRound, Settings, Monitor, ShieldCheck, Globe, MessageCircle, UsersRound, LifeBuoy } from 'lucide-react';
export const systems = [
  { key:'customers', titleAr:'ادارة العملاء', titleEn:'Customer Management', href:'/customers', icon:Users },
  { key:'accounting', titleAr:'المحاسبة', titleEn:'Accounting', href:'/accounting', icon:Receipt },
  { key:'whatsapp_sender', titleAr:'مرسل واتساب', titleEn:'WhatsApp Sender', href:'/whatsapp-sender', icon:Send },
  { key:'email_sender', titleAr:'مرسل البريد', titleEn:'Email Sender', href:'/email-sender', icon:MailPlus },
  { key:'email_dashboard', titleAr:'لوحة البريد', titleEn:'Email Dashboard', href:'/email-dashboard', icon:Inbox },
  { key:'hr', titleAr:'الموارد البشرية', titleEn:'Human Resources', href:'/hr', icon:UserRound },
  { key:'settings', titleAr:'الاعدادات', titleEn:'Settings', href:'/settings', icon:Settings, adminOnly:true },
  { key:'task_monitor', titleAr:'متابعة المهام', titleEn:'Task Monitor', href:'/monitor', icon:Monitor },
  { key:'vault', titleAr:'منظور فولت', titleEn:'Manzor Vault', href:'/vault', icon:ShieldCheck },
  { key:'website', titleAr:'الموقع الالكتروني', titleEn:'Website', href:'/', icon:Globe },
  { key:'whatsapp', titleAr:'واتساب', titleEn:'WhatsApp', href:'/whatsapp', icon:MessageCircle },
  { key:'team', titleAr:'منظور تيم', titleEn:'Manzor Team', href:'/team', icon:UsersRound },
  { key:'customer_tickets', titleAr:'تذاكر العملاء', titleEn:'Customer Tickets', href:'/customer-tickets', icon:LifeBuoy },
];
