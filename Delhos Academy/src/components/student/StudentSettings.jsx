import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Lock, Save, Loader2, CheckCircle, Upload, X, Plus, Trash2 } from 'lucide-react';
import { api } from '@/api/client';


export default function StudentSettings({ studentData, onUpdate }) {
  const [formData, setFormData] = useState({
    name: studentData?.name || '',
    email: studentData?.email || '',
    profile_image: studentData?.profile_image || '',
    bio: studentData?.bio || '',
    linkedin: studentData?.linkedin || '',
    website: studentData?.website || '',
    specialties: studentData?.specialties || [],
    achievements: studentData?.achievements || [],
    certifications: studentData?.certifications || []
  });
  const [uploading, setUploading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, profile_image: file_url });
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error al subir la imagen');
    }
    setUploading(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.entities.Student.update(studentData.id, {
        name: formData.name,
        profile_image: formData.profile_image,
        bio: formData.bio,
        linkedin: formData.linkedin,
        website: formData.website,
        specialties: formData.specialties,
        achievements: formData.achievements,
        certifications: formData.certifications
      });
      
      // Recargar datos actualizados de la base de datos
      const updatedStudent = await api.entities.Student.filter({ id: studentData.id });
      const freshData = updatedStudent[0];
      
      localStorage.setItem('studentSession', JSON.stringify(freshData));
      onUpdate(freshData);
      
      setSuccess('Perfil actualizado correctamente');
      
      // Forzar recarga de la UI después de un breve delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError('Error al actualizar el perfil');
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.currentPassword !== studentData.password) {
      setError('La contraseña actual es incorrecta');
      setPasswordLoading(false);
      return;
    }

    try {
      await api.entities.Student.update(studentData.id, {
        password: passwordData.newPassword
      });
      
      // Actualizar sesión local
      const updatedStudent = { ...studentData, password: passwordData.newPassword };
      localStorage.setItem('studentSession', JSON.stringify(updatedStudent));
      onUpdate(updatedStudent);
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Contraseña actualizada correctamente');
    } catch (err) {
      setError('Error al cambiar la contraseña');
    }
    setPasswordLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-[#1E3A5F] mb-6">Configuración y Contacto</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#2E6DB4]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#2E6DB4]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#1E3A5F]">Datos Personales</h2>
                  <p className="text-sm text-slate-500">Actualiza tu información</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Profile Image */}
                <div>
                  <Label>Foto de perfil</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {formData.profile_image ? (
                      <div className="relative">
                        <img 
                          src={formData.profile_image} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                        />
                        <Button
                          type="button"
                          size="icon" aria-label="Quitar"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                          onClick={() => setFormData({ ...formData, profile_image: '' })}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#2E6DB4]/10 flex items-center justify-center text-3xl font-bold text-[#2E6DB4]">
                        {formData.name.charAt(0) || 'E'}
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <Button type="button" variant="outline" disabled={uploading} asChild>
                        <span>
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                          {uploading ? 'Subiendo...' : 'Cambiar foto'}
                        </span>
                      </Button>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Nombre completo</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                <div>
                  <Label>Correo electrónico</Label>
                  <Input
                    value={formData.email}
                    disabled
                    className="mt-1.5 rounded-xl bg-slate-50"
                  />
                  <p className="text-xs text-slate-400 mt-1">El correo no puede ser modificado</p>
                </div>

                <div>
                  <Label>Biografía</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Cuéntanos un poco sobre ti..."
                    className="mt-1.5 rounded-xl h-24"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>LinkedIn</Label>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Sitio web</Label>
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://..."
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                </div>

                {/* Áreas de Interés */}
                <div>
                  <Label>Áreas de Interés</Label>
                  <div className="space-y-2 mt-1.5">
                    {formData.specialties.map((specialty, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={specialty}
                          onChange={(e) => {
                            const newSpecialties = [...formData.specialties];
                            newSpecialties[idx] = e.target.value;
                            setFormData({ ...formData, specialties: newSpecialties });
                          }}
                          className="rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon" aria-label="Eliminar"
                          className="rounded-xl"
                          onClick={() => {
                            const newSpecialties = formData.specialties.filter((_, i) => i !== idx);
                            setFormData({ ...formData, specialties: newSpecialties });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, specialties: [...formData.specialties, ''] })}
                      className="rounded-xl w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar área de interés
                    </Button>
                  </div>
                </div>

                {/* Logros */}
                <div>
                  <Label>Logros y Reconocimientos</Label>
                  <div className="space-y-2 mt-1.5">
                    {formData.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={achievement}
                          onChange={(e) => {
                            const newAchievements = [...formData.achievements];
                            newAchievements[idx] = e.target.value;
                            setFormData({ ...formData, achievements: newAchievements });
                          }}
                          className="rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon" aria-label="Eliminar"
                          className="rounded-xl"
                          onClick={() => {
                            const newAchievements = formData.achievements.filter((_, i) => i !== idx);
                            setFormData({ ...formData, achievements: newAchievements });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, achievements: [...formData.achievements, ''] })}
                      className="rounded-xl w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar logro
                    </Button>
                  </div>
                </div>

                {/* Certificaciones */}
                <div>
                  <Label>Certificaciones</Label>
                  <div className="space-y-2 mt-1.5">
                    {formData.certifications.map((cert, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={cert}
                          onChange={(e) => {
                            const newCerts = [...formData.certifications];
                            newCerts[idx] = e.target.value;
                            setFormData({ ...formData, certifications: newCerts });
                          }}
                          className="rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon" aria-label="Eliminar"
                          className="rounded-xl"
                          onClick={() => {
                            const newCerts = formData.certifications.filter((_, i) => i !== idx);
                            setFormData({ ...formData, certifications: newCerts });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, certifications: [...formData.certifications, ''] })}
                      className="rounded-xl w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar certificación
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="bg-[#2E6DB4] hover:bg-[#1E3A5F] rounded-full"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Guardar cambios
                </Button>
              </form>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#1E3A5F]">Cambiar Contraseña</h2>
                  <p className="text-sm text-slate-500">Actualiza tu contraseña de acceso</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label>Contraseña actual</Label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label>Nueva contraseña</Label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label>Confirmar nueva contraseña</Label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="outline"
                  className="rounded-full border-orange-300 text-orange-600 hover:bg-orange-50"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                  Cambiar contraseña
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column - Course Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-[#1E3A5F] mb-4">Información del Curso</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500">Curso</p>
                <p className="font-medium text-slate-900">{studentData?.course_name || 'N/A'}</p>
              </div>
              {studentData?.instructor_name && (
                <div>
                  <p className="text-xs text-slate-500">Instructor</p>
                  <p className="font-medium text-slate-900">{studentData.instructor_name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}