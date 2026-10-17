import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Lock, Save, Loader2, CheckCircle, Upload, X, Plus, Trash2, GraduationCap, Briefcase, Award, Link as LinkIcon } from 'lucide-react';
import { api } from '@/api/client';

export default function InstructorSettings({ instructorData, onUpdate }) {
  const [formData, setFormData] = useState({
    name: instructorData?.name || '',
    email: instructorData?.email || '',
    bio: instructorData?.bio || '',
    profile_image: instructorData?.profile_image || '',
    specialties: instructorData?.specialties || [],
    education: instructorData?.education || [],
    experience: instructorData?.experience || [],
    achievements: instructorData?.achievements || [],
    certifications: instructorData?.certifications || [],
    linkedin: instructorData?.linkedin || '',
    website: instructorData?.website || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      await api.entities.Instructor.update(instructorData.id, formData);
      
      // Recargar datos actualizados de la base de datos
      const updatedInstructor = await api.entities.Instructor.filter({ id: instructorData.id });
      const freshData = updatedInstructor[0];
      
      localStorage.setItem('instructorSession', JSON.stringify(freshData));
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

    if (passwordData.currentPassword !== instructorData.password) {
      setError('La contraseña actual es incorrecta');
      setPasswordLoading(false);
      return;
    }

    try {
      await api.entities.Instructor.update(instructorData.id, {
        password: passwordData.newPassword
      });
      
      const updatedInstructor = { ...instructorData, password: passwordData.newPassword };
      localStorage.setItem('instructorSession', JSON.stringify(updatedInstructor));
      onUpdate(updatedInstructor);
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Contraseña actualizada correctamente');
    } catch (err) {
      setError('Error al cambiar la contraseña');
    }
    setPasswordLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-[#1E3A5F] mb-6">Configuración de Perfil</h1>

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

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#2E6DB4]/20 flex items-center justify-center">
                <User className="w-5 h-5 text-[#2E6DB4]" />
              </div>
              <div>
                <h2 className="font-semibold text-[#1E3A5F]">Información Personal</h2>
                <p className="text-sm text-slate-500">Actualiza tu información de instructor</p>
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
                      {formData.name.charAt(0) || 'I'}
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre completo</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Correo electrónico</Label>
                  <Input
                    value={formData.email}
                    disabled
                    className="mt-1.5 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <Label>Biografía</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Cuéntanos sobre tu experiencia y especialización..."
                  className="mt-1.5 h-24"
                />
              </div>

              {/* Specialties */}
              <div>
                <Label>Especialidades</Label>
                <div className="mt-2 space-y-2">
                  {formData.specialties.map((specialty, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={specialty}
                        onChange={(e) => {
                          const newSpecialties = [...formData.specialties];
                          newSpecialties[index] = e.target.value;
                          setFormData({ ...formData, specialties: newSpecialties });
                        }}
                        placeholder="Ej: Machine Learning"
                      />
                      <Button
                        type="button"
                        size="icon" aria-label="Eliminar"
                        variant="outline"
                        onClick={() => {
                          const newSpecialties = formData.specialties.filter((_, i) => i !== index);
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
                    size="sm"
                    onClick={() => setFormData({ ...formData, specialties: [...formData.specialties, ''] })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar especialidad
                  </Button>
                </div>
              </div>

              {/* LinkedIn & Website */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Sitio web</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                    className="mt-1.5"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="bg-[#2E6DB4] hover:bg-[#1E3A5F]"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Guardar cambios
              </Button>
            </form>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-[#1E3A5F]">Educación</h2>
                <p className="text-sm text-slate-500">Formación académica</p>
              </div>
            </div>

            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-[#1E3A5F]">Educación {index + 1}</h3>
                    <Button
                      type="button"
                      size="icon" aria-label="Eliminar"
                      variant="ghost"
                      onClick={() => {
                        const newEducation = formData.education.filter((_, i) => i !== index);
                        setFormData({ ...formData, education: newEducation });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={edu.degree}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index].degree = e.target.value;
                      setFormData({ ...formData, education: newEducation });
                    }}
                    placeholder="Título/Grado"
                  />
                  <Input
                    value={edu.institution}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index].institution = e.target.value;
                      setFormData({ ...formData, education: newEducation });
                    }}
                    placeholder="Institución"
                  />
                  <Input
                    value={edu.year}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index].year = e.target.value;
                      setFormData({ ...formData, education: newEducation });
                    }}
                    placeholder="Año"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ 
                  ...formData, 
                  education: [...formData.education, { degree: '', institution: '', year: '' }] 
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar educación
              </Button>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#EAF2FB] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#1E4E86]" />
              </div>
              <div>
                <h2 className="font-semibold text-[#1E3A5F]">Experiencia Profesional</h2>
                <p className="text-sm text-slate-500">Trayectoria laboral</p>
              </div>
            </div>

            <div className="space-y-4">
              {formData.experience.map((exp, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-[#1E3A5F]">Experiencia {index + 1}</h3>
                    <Button
                      type="button"
                      size="icon" aria-label="Eliminar"
                      variant="ghost"
                      onClick={() => {
                        const newExperience = formData.experience.filter((_, i) => i !== index);
                        setFormData({ ...formData, experience: newExperience });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={exp.position}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index].position = e.target.value;
                      setFormData({ ...formData, experience: newExperience });
                    }}
                    placeholder="Cargo"
                  />
                  <Input
                    value={exp.company}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index].company = e.target.value;
                      setFormData({ ...formData, experience: newExperience });
                    }}
                    placeholder="Empresa"
                  />
                  <Input
                    value={exp.period}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index].period = e.target.value;
                      setFormData({ ...formData, experience: newExperience });
                    }}
                    placeholder="Período (Ej: 2020 - 2023)"
                  />
                  <Textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExperience = [...formData.experience];
                      newExperience[index].description = e.target.value;
                      setFormData({ ...formData, experience: newExperience });
                    }}
                    placeholder="Descripción"
                    className="h-20"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ 
                  ...formData, 
                  experience: [...formData.experience, { position: '', company: '', period: '', description: '' }] 
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar experiencia
              </Button>
            </div>
          </div>

          {/* Achievements & Certifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-[#1E3A5F]">Logros y Certificaciones</h2>
                <p className="text-sm text-slate-500">Reconocimientos profesionales</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Logros destacados</Label>
                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={achievement}
                        onChange={(e) => {
                          const newAchievements = [...formData.achievements];
                          newAchievements[index] = e.target.value;
                          setFormData({ ...formData, achievements: newAchievements });
                        }}
                        placeholder="Describe un logro importante"
                      />
                      <Button
                        type="button"
                        size="icon" aria-label="Eliminar"
                        variant="outline"
                        onClick={() => {
                          const newAchievements = formData.achievements.filter((_, i) => i !== index);
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
                    size="sm"
                    onClick={() => setFormData({ ...formData, achievements: [...formData.achievements, ''] })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar logro
                  </Button>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Certificaciones</Label>
                <div className="space-y-2">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={cert}
                        onChange={(e) => {
                          const newCertifications = [...formData.certifications];
                          newCertifications[index] = e.target.value;
                          setFormData({ ...formData, certifications: newCertifications });
                        }}
                        placeholder="Nombre de la certificación"
                      />
                      <Button
                        type="button"
                        size="icon" aria-label="Eliminar"
                        variant="outline"
                        onClick={() => {
                          const newCertifications = formData.certifications.filter((_, i) => i !== index);
                          setFormData({ ...formData, certifications: newCertifications });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, certifications: [...formData.certifications, ''] })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar certificación
                  </Button>
                </div>
              </div>
            </div>
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
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label>Nueva contraseña</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label>Confirmar nueva contraseña</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="mt-1.5"
                  required
                />
              </div>
              <Button 
                type="submit" 
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
                disabled={passwordLoading}
              >
                {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                Cambiar contraseña
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}