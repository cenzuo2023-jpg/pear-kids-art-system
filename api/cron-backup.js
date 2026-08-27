import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://woiclaaofyfshphjvcsm.supabase.co';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_WSjIp6vyywhroIJRbvUKdw_jFlPmBx5';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const [{ data: students }, { data: attendance }, { data: classes }] = await Promise.all([
      supabase.from('students').select('*'),
      supabase.from('attendance').select('*'),
      supabase.from('classes').select('*')
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      students: students || [],
      attendance: attendance || [],
      classes: classes || []
    };
    
    const backupJson = JSON.stringify(backupData, null, 2);

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const targetEmail = process.env.BACKUP_EMAIL || smtpUser;
    
    if (!smtpUser || !smtpPass) {
      return res.status(500).json({ error: 'SMTP Environment Variables Missing' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.qq.com',
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const dateStr = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    const filenameDate = new Date().toISOString().slice(0, 10);

    await transporter.sendMail({
      from: `"想吃梨数据中心" <${smtpUser}>`,
      to: targetEmail,
      subject: `[想吃梨儿童美术] 教务系统全量数据备份 - ${filenameDate}`,
      text: `您好，\n\n附件是截止到 ${dateStr} 的系统核心数据备份（JSON 格式）。\n\n数据包含：\n- 学员档案总库\n- 考勤与课消历史\n- 班级配置\n\n请妥善保存该备份包。若云端数据发生意外，可使用该文件进行完整恢复。\n\n[由系统定时自动发送]`,
      attachments: [
        {
          filename: `pear-kids-backup-${filenameDate}.json`,
          content: backupJson
        }
      ]
    });

    res.status(200).json({ success: true, message: 'Backup emailed successfully' });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ error: error.message });
  }
}
