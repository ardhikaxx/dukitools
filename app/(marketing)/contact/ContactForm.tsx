'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/toast/toastStore';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.warning('Mohon lengkapi seluruh field.');
      return;
    }
    setLoading(true);
    // Simulate API call - in production this would POST to /api/contact
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Pesan berhasil dikirim. Kami akan segera merespons.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Nama Anda"
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="email@anda.com"
      />
      <Textarea
        label="Pesan"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Tulis pesan Anda di sini..."
        rows={5}
      />
      <Button type="submit" variant="primary" loading={loading} fullWidth>
        Kirim Pesan
      </Button>
    </form>
  );
}
